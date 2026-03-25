import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';

const categoryColors: Record<string, string> = {
  TECHNOLOGY: 'bg-indigo-600',
  TRAVEL: 'bg-sky-500',
  FOODS: 'bg-orange-600',
  LIFESTYLE: 'bg-lime-600',
  FINANCE: 'bg-emerald-600',
  GAMING: 'bg-violet-600',
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string || (content ? content.substring(0, 100) + '...' : '');
    const category = (formData.get('category') as string || 'TECHNOLOGY').toUpperCase();
    const categoryColor = categoryColors[category] || 'bg-gray-600';
    const author = formData.get('author') as string;
    const imageUrl = formData.get('imageUrl') as string || formData.get('coverImageUrl') as string || '';

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'title, content, and author are required fields in the form data' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute) + '-min read';

    const post = await BlogPost.create({
      title,
      content,
      excerpt,
      category,
      categoryColor,
      author,
      date,
      readTime,
      imageUrl,
    });

    return NextResponse.json(
      { message: 'Blog post created successfully from form data', post },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
