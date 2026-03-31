import mongoose, { Schema, Document, Model } from 'mongoose';
import { CATEGORY_COLORS } from '@/lib/constants';

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
    timestamps: true,
  }
);

blogPostSchema.pre<IBlogPost>('save', async function () {
  if (this.isModified('category') || this.isNew) {
    this.categoryColor = CATEGORY_COLORS[this.category?.toUpperCase() || ''] || 'bg-gray-600';
  }

  if (!this.isModified('title')) {
    return;
  }

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const baseSlug = slugify(this.title);
  let candidateSlug = baseSlug;
  let counter = 1;

  const BlogPostModel = (this.constructor as mongoose.Model<IBlogPost>);
  
  while (true) {
    const existingPost = await BlogPostModel.findOne({ slug: candidateSlug });
    
    if (!existingPost || existingPost._id.equals(this._id)) {
      break;
    }
    
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = candidateSlug;
});

// Clear mongoose model cache in development to ensure schema updates apply
if (process.env.NODE_ENV !== 'production' && mongoose.models.BlogPost) {
  delete mongoose.models.BlogPost;
}

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
