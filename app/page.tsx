import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import HomeClient from '@/components/HomeClient';
import type { Article } from '@/lib/constants';

export default async function Page() {
  await connectToDatabase();

  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  // Map to Article, converting _id to string and providing fallbacks for legacy posts
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
  }));

  const featuredArticles = serializedPosts.slice(0, 3);
  const latestArticles = serializedPosts.slice(3, 9);

  return <HomeClient featuredArticles={featuredArticles} latestArticles={latestArticles} />;
}