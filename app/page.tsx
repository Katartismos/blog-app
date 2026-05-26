/**
 * Home Page (Server Component)
 * 
 * This is the main landing page of the blog.
 * Optimizations implemented:
 * 1. .limit(9): Only fetch the posts needed for the initial view.
 * 2. .select('-content'): Exclude the heavy content field to reduce payload size.
 * 3. Aggregation Pipeline: Efficiently calculate category counts in the database.
 */

import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import HomeClient from '@/components/HomeClient';
import type { Article } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Ensure database connection is established
  await connectToDatabase();

  /**
   * Optimization 1 & 2: Efficient Querying
   * We only need 9 posts for the homepage. We also exclude the 'content' field
   * because it's only needed on the individual post detail pages.
   */
  const posts = await BlogPost.find({})
    .sort({ createdAt: -1 })
    .limit(9)
    .select('-content -authorImage') // Exclude heavy or unused fields
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

  // Split posts into logical sections for the UI
  const featuredArticles = serializedPosts.slice(0, 3); // Top 3 posts
  const latestArticles = serializedPosts.slice(3, 9);   // Next 6 posts
  
  // Optimization: Check if more posts exist without fetching all of them
  const totalPostsCount = await BlogPost.countDocuments();
  const hasMore = totalPostsCount > 9;

  /**
   * Optimization 3: MongoDB Aggregation
   * Instead of filtering all posts in memory, we let MongoDB group and count them.
   */
  const aggregationResult = await BlogPost.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    }
  ]);

  // Map the aggregation results back to our topics format
  const categoriesList = ['TECHNOLOGY', 'TRAVEL', 'FOODS', 'LIFESTYLE', 'FINANCE', 'GAMING'];
  const topicsInfo = categoriesList.map(cat => {
    const found = aggregationResult.find(res => res._id?.toUpperCase() === cat);
    return {
      name: cat.charAt(0) + cat.slice(1).toLowerCase(),
      count: found ? found.count : 0
    };
  });

  // Render the Client Component with the prepared data
  return (
    <HomeClient 
      featuredArticles={featuredArticles} 
      latestArticles={latestArticles} 
      hasMore={hasMore} 
      topics={topicsInfo} 
    />
  );
}