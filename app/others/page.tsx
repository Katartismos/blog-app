import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import OthersClient from '@/components/OthersClient';
import type { Article } from '@/lib/constants';

export default async function OthersPage() {
  await connectToDatabase();

  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  // Map to Article
  const serializedPosts: Article[] = posts.map((post: any) => ({
    ...post,
    _id: post._id.toString(),
    title: post.title || 'Untitled',
    imageUrl: post.imageUrl || 'https://placehold.co/800x600/374151/ffffff?text=No+Image',
    category: post.category || 'TECHNOLOGY',
    categoryColor: post.categoryColor || 'bg-indigo-600',
    date: post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'),
    readTime: post.readTime || '5-min read',
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No excerpt available.'),
    author: post.author || 'Admin User',
  }));

  const olderPosts = serializedPosts.slice(9);

  return <OthersClient olderPosts={olderPosts} />;
}
