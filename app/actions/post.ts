/**
 * Post Server Actions
 * 
 * Contains functions that run on the server to handle blog post operations.
 * Currently supports creating new posts with:
 * - Authentication verification
 * - HTML sanitization
 * - Image upload to Cloudinary
 * - Database storage via Mongoose
 * - Cache revalidation
 */

'use server'

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import sanitizeHtml from 'sanitize-html';
import { auth } from '@/auth';

/**
 * HTML Sanitization Options
 * 
 * Defines which tags and attributes are allowed in the blog post content.
 * This prevents XSS attacks by stripping malicious scripts and styles.
 */
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'hr',
    'a',
  ],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

/**
 * createPost
 * 
 * A Server Action to create a new blog post.
 * 
 * @param {FormData} formData - The submitted form data containing title, content, image, etc.
 * @returns {Promise<{error?: string, success?: boolean}>} Result of the operation.
 */
export async function createPost(formData: FormData) {
  // 1. Verify User Authentication
  const session = await auth();
  if (!session?.user) {
    return { error: 'You must be logged in to create a post.' };
  }

  // 2. Extract Data from FormData
  const title = formData.get('title') as string;
  const rawContent = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const category = (formData.get('category') as string || 'TECHNOLOGY').toUpperCase();
  const imageFile = formData.get('image') as File | null;

  // 3. Basic Field Validation
  if (!title || !rawContent) {
    return { error: 'Title and content are required fields.' };
  }

  // 4. Content Sanitization
  // Sanitize the HTML content to prevent XSS.
  const content = sanitizeHtml(rawContent, sanitizeOptions);

  // 5. Length Validation (Plain Text)
  const plainText = content.replace(/<[^>]+>/g, '').trim();
  if (plainText.length < 30) {
    return { error: 'Content must be at least 30 characters long.' };
  }

  if (!excerpt) {
    return { error: 'Excerpt is a required field.' };
  }

  if (!imageFile || imageFile.size === 0) {
    return { error: 'An image is required.' };
  }

  // 6. Image Upload to Cloudinary
  let imageUrl = '';
  if (imageFile && imageFile.size > 0) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_PRESET_NAME;
    
    if (!cloudName || !uploadPreset) {
      return { error: 'Cloudinary configuration is missing.' };
    }

    const uploadData = new FormData();
    uploadData.append('file', imageFile);
    uploadData.append('upload_preset', uploadPreset);

    try {
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadRes.ok) {
        return { error: 'Failed to upload image to Cloudinary.' };
      }

      const uploadJson = await uploadRes.json();
      imageUrl = uploadJson.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { error: 'Error uploading image to Cloudinary.' };
    }
  }

  // 7. Database Persistence
  try {
    await connectToDatabase();

    // Format display date
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Estimate read time (assuming 200 words per minute)
    const words = plainText.split(/\s+/).filter(Boolean).length;
    const readTime = Math.ceil(words / 200) + '-min read';

    // Create the document in MongoDB
    await BlogPost.create({
      title,
      content,
      excerpt,
      category,
      author: session.user.name || 'Anonymous User',
      authorImage: session.user.image || '',
      date,
      readTime,
      imageUrl,
    });

  } catch (error: Error | unknown) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    return { error: errorMessage || 'Failed to create the blog post. Please try again later.' };
  }

  // 8. Revalidate Cache
  // Forces Next.js to refresh the home page data so the new post appears immediately.
  revalidatePath('/');
  
  return { success: true };
}
