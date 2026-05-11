/**
 * Blog Post Model
 * 
 * Defines the schema and interface for blog posts stored in MongoDB.
 * Includes automated slug generation and category color assignment.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { CATEGORY_COLORS } from '@/lib/constants';

/**
 * IBlogPost Interface
 * 
 * Represents the structure of a Blog Post document in TypeScript.
 */
export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  imageUrl: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Post Schema
 * 
 * Mongoose schema definition for the 'BlogPost' collection.
 */
const blogPostSchema = new Schema(
  {
    slug: { type: String, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'TECHNOLOGY' },
    categoryColor: { type: String, default: 'bg-indigo-600' },
    author: { type: String, required: true },
    authorImage: { type: String, default: '' },
    date: { type: String, default: '' },
    readTime: { type: String, default: '5-min read' },
    imageUrl: { type: String, default: '' },
    content: { type: String, required: true },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save Hook
 * 
 * Automatically runs before a document is saved to the database.
 * 1. Assigns category colors based on constants.
 * 2. Generates a unique, URL-friendly slug from the title.
 */
blogPostSchema.pre<IBlogPost>('save', async function () {
  // Update category color if category changed or document is new
  if (this.isModified('category') || this.isNew) {
    this.categoryColor = CATEGORY_COLORS[this.category?.toUpperCase() || ''] || 'bg-gray-600';
  }

  // Only regenerate slug if title has changed
  if (!this.isModified('title')) {
    return;
  }

  /**
   * Helper function to convert string to URL-friendly slug
   */
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
      .replace(/^-+/, '')       // Trim - from start of text
      .replace(/-+$/, '');      // Trim - from end of text
  };

  const baseSlug = slugify(this.title);
  let candidateSlug = baseSlug;
  let counter = 1;

  const BlogPostModel = (this.constructor as mongoose.Model<IBlogPost>);
  
  // Ensure the slug is unique by appending a counter if it already exists
  while (true) {
    const existingPost = await BlogPostModel.findOne({ slug: candidateSlug });
    
    // If no post exists with this slug, or the post found is the current one, the slug is valid
    if (!existingPost || existingPost._id.equals(this._id)) {
      break;
    }
    
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = candidateSlug;
});

// Clear mongoose model cache in development to ensure schema updates apply correctly during hot reloads
if (process.env.NODE_ENV !== 'production' && mongoose.models.BlogPost) {
  delete mongoose.models.BlogPost;
}

/**
 * BlogPost Model
 * 
 * The compiled Mongoose model used for database operations.
 */
const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
