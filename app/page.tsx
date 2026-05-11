/**
 * Home Page (Server Component)
 * 
 * This is the main landing page of the blog. It:
 * 1. Connects to the MongoDB database.
 * 2. Fetches all blog posts, sorted by creation date (newest first).
 * 3. Serializes the database documents into plain objects (Articles) for the client.
 * 4. Categorizes posts into "Featured" and "Latest" sections.
 * 5. Calculates the number of posts in each category for the sidebar.
 * 6. Passes the data to the HomeClient component for rendering.
 */

import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import HomeClient from '@/components/HomeClient';
import type { Article } from '@/lib/constants';

export default async function Page() {
  // Ensure database connection is established
  await connectToDatabase();

  // Fetch all posts from the database
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  /**
   * Data Serialization
   * 
   * Converts Mongoose documents to plain JavaScript objects to avoid 
   * issues with passing Date objects or complex Mongoose types to Client Components.
   */
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

  // Split posts into logical sections for the UI
  const featuredArticles = serializedPosts.slice(0, 3); // Top 3 posts
  const latestArticles = serializedPosts.slice(3, 9);   // Next 6 posts
  const hasMore = serializedPosts.length > 9;           // Flag for pagination/load more

  /**
   * Topic Calculation
   * 
   * Aggregates post counts for each predefined category to be displayed in the sidebar.
   */
  const categoriesList = ['TECHNOLOGY', 'TRAVEL', 'FOODS', 'LIFESTYLE', 'FINANCE', 'GAMING'];
  const topicsInfo = categoriesList.map(cat => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(), // Format: "Technology"
    count: posts.filter((p: import('@/lib/models/BlogPost').IBlogPost) => (p.category || 'TECHNOLOGY').toUpperCase() === cat).length
  }));

  // Render the Client Component with the prepared data
  return <HomeClient featuredArticles={featuredArticles} latestArticles={latestArticles} hasMore={hasMore} topics={topicsInfo} />;
}