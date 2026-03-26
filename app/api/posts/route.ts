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
    const imageFile = formData.get('image') as File | null;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'title, content, and author are required fields in the form data' },
        { status: 400 }
      );
    }

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.CLOUDINARY_PRESET_NAME;
      if (!cloudName || !uploadPreset) {
        return NextResponse.json({ error: 'Cloudinary configuration is missing' }, { status: 500 });
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
          return NextResponse.json({ error: 'Failed to upload image to Cloudinary' }, { status: 500 });
        }
        
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ error: 'Error uploading image to Cloudinary' }, { status: 500 });
      }
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
