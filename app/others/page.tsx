/**
 * Others Page (Server Component)
 * 
 * Displays a list of older blog posts (everything beyond the first 9 shown on the home page).
 * It uses the same categorization logic as the home page to maintain consistency in the sidebar.
 */

import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import OthersClient from '@/components/OthersClient';
import type { Article } from '@/lib/constants';

export default async function OthersPage() {
  // Ensure database connection
  await connectToDatabase();

  // Fetch all posts from the database, sorted by newest first
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  /**
   * Data Serialization
   * 
   * Maps database documents to plain objects. 
   * Note: This picks all properties and converts the _id to a string for client-side safety.
   */
  const serializedPosts: Article[] = posts.map((post: import('@/lib/models/BlogPost').IBlogPost) => ({
    ...post,
    _id: String(post._id),
    title: post.title || 'Untitled',
    imageUrl: post.imageUrl || 'https://placehold.co/800x600/374151/ffffff?text=No+Image',
    category: post.category || 'TECHNOLOGY',
    categoryColor: post.categoryColor || 'bg-indigo-600',
    date: post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'),
    readTime: post.readTime || '5-min read',
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No excerpt available.'),
    author: post.author || 'Admin User',
  }));

  // Extract older posts (starting from index 9)
  const olderPosts = serializedPosts.slice(9);

  /**
   * Topic Calculation
   * 
   * Aggregates post counts for categories to populate the sidebar.
   */
  const categoriesList = ['TECHNOLOGY', 'TRAVEL', 'FOODS', 'LIFESTYLE', 'FINANCE', 'GAMING'];
  const topicsInfo = categoriesList.map(cat => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(), // Format: "Technology"
    count: posts.filter((p: import('@/lib/models/BlogPost').IBlogPost) => (p.category || 'TECHNOLOGY').toUpperCase() === cat).length
  }));

  // Render the Client Component for the others page
  return <OthersClient olderPosts={olderPosts} topics={topicsInfo} />;
}
