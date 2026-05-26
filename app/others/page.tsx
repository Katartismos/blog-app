/**
 * Others Page (Server Component)
 * 
 * Displays a list of older blog posts.
 * Optimizations implemented:
 * 1. .skip(9): Skip the posts already shown on the homepage.
 * 2. .select('-content'): Exclude large content field for faster data transfer.
 * 3. Aggregation Pipeline: Efficiently calculate category counts.
 */

import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import OthersClient from '@/components/OthersClient';
import type { Article } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function OthersPage() {
  // Ensure database connection
  await connectToDatabase();

  /**
   * Optimization 1 & 2: Skip and Select
   * We skip the first 9 posts (featured + latest) and select only needed fields.
   */
  const posts = await BlogPost.find({})
    .sort({ createdAt: -1 })
    .skip(9)
    .select('-content -authorImage')
    .lean();

  /**
   * Data Serialization
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedPosts: Article[] = posts.map((post: any) => ({
    _id: String(post._id),
    slug: post.slug || '',
    title: post.title || 'Untitled',
    imageUrl: post.imageUrl || 'https://placehold.co/800x600/374151/ffffff?text=No+Image',
    category: post.category || 'TECHNOLOGY',
    categoryColor: post.categoryColor || 'bg-indigo-600',
    date: post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'),
    readTime: post.readTime || '5-min read',
    excerpt: post.excerpt || 'No excerpt available.',
    author: post.author || 'Admin User',
  }));

  /**
   * Optimization 3: MongoDB Aggregation
   */
  const aggregationResult = await BlogPost.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    }
  ]);

  const categoriesList = ['TECHNOLOGY', 'TRAVEL', 'FOODS', 'LIFESTYLE', 'FINANCE', 'GAMING'];
  const topicsInfo = categoriesList.map(cat => {
    const found = aggregationResult.find(res => res._id?.toUpperCase() === cat);
    return {
      name: cat.charAt(0) + cat.slice(1).toLowerCase(),
      count: found ? found.count : 0
    };
  });

  // Render the Client Component for the others page
  return <OthersClient olderPosts={serializedPosts} topics={topicsInfo} />;
}
