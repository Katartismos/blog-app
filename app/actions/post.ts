'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string || (content ? content.substring(0, 100) + '...' : '');
  const category = (formData.get('category') as string || 'TECHNOLOGY').toUpperCase();
  const imageUrl = formData.get('imageUrl') as string || formData.get('coverImage') as string || '';
  
  if (!title || !content) {
    return { error: 'Title and content are required fields.' };
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
  redirect('/');
}
