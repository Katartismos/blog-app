'use server'

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string || (content ? content.substring(0, 100) + '...' : '');
  const category = (formData.get('category') as string || 'TECHNOLOGY').toUpperCase();
  const imageFile = formData.get('image') as File | null;
  
  if (!title || !content) {
    return { error: 'Title and content are required fields.' };
  }

  if (!excerpt) {
    return { error: 'Excerpt is a required field.' };
  }

  if (!imageFile || imageFile.size === 0) {
    return { error: 'An image is required.' };
  }

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

  try {
    await connectToDatabase();
    
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200) + '-min read';
    
    await BlogPost.create({
      title,
      content,
      excerpt,
      category,
      author: 'Admin User',
      date,
      readTime,
      imageUrl,
    });
    
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { error: error.message || 'Failed to create the blog post. Please try again later.' };
  }

  revalidatePath('/');
  return { success: true };
}
