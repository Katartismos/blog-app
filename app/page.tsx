import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import HomeClient from '@/components/HomeClient';
import type { Article } from '@/lib/constants';

export default async function Page() {
  await connectToDatabase();

  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  // Map to Article, strictly picking properties to prevent Date object leaks
  const serializedPosts: Article[] = posts.map((post: import('@/lib/models/BlogPost').IBlogPost) => ({
    _id: String(post._id),
    slug: post.slug || '',
    title: post.title || 'Untitled',
    imageUrl: post.imageUrl || 'https://placehold.co/800x600/374151/ffffff?text=No+Image',
    category: post.category || 'TECHNOLOGY',
    categoryColor: post.categoryColor || 'bg-indigo-600',
    date: post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'),
    readTime: post.readTime || '5-min read',
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No excerpt available.'),
    author: post.author || 'Admin User',
  }));

  const featuredArticles = serializedPosts.slice(0, 3);
  const latestArticles = serializedPosts.slice(3, 9);
  const hasMore = serializedPosts.length > 9;

  // Calculate dynamic topics count based on the 6 predefined categories
  const categoriesList = ['TECHNOLOGY', 'TRAVEL', 'FOODS', 'LIFESTYLE', 'FINANCE', 'GAMING'];
  const topicsInfo = categoriesList.map(cat => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(), // e.g. Technology
    count: posts.filter((p: import('@/lib/models/BlogPost').IBlogPost) => (p.category || 'TECHNOLOGY').toUpperCase() === cat).length
  }));

  return <HomeClient featuredArticles={featuredArticles} latestArticles={latestArticles} hasMore={hasMore} topics={topicsInfo} />;
}