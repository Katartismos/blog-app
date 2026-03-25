export interface Article { 
  _id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

export interface ArticleProps {
  article: Article;
}

export const featuredArticles: Article[] = [
  { 
    title: 'Innovate & Create', 
    excerpt: 'Explore essential mindset shifts for digital entrepreneurs.', 
    category: 'TECHNOLOGY', 
    categoryColor: 'bg-indigo-600', 
    author: 'Alex Chloe', 
    date: 'Mar 13, 2024', 
    readTime: '5-min read', 
    imageUrl: '/images/innovate.jpg' 
  },
  { 
    title: 'Wanderlust Chronicles', 
    excerpt: 'Discover breathtaking landscapes and hidden trails.', 
    category: 'TRAVEL', 
    categoryColor: 'bg-sky-500', 
    author: 'Alex Chloe', 
    date: 'Mar 13, 2024', 
    readTime: '7-min read', 
    imageUrl: '/images/wanderlust.jpg' 
  },
  { 
    title: 'Culinary Delights', 
    excerpt: 'Mastering the art of simple, gourmet Italian cooking.', 
    category: 'FOODS', 
    categoryColor: 'bg-orange-600', 
    author: 'Alex Chloe', 
    date: 'Mar 13, 2024', 
    readTime: '6-min read', 
    imageUrl: '/images/culinary.jpg' 
  },
];

export const latestArticles: Article[] = [
  { 
    title: "AI's Impact on Future Tech", 
    excerpt: 'Discover how artificial intelligence is shaping modern shopping.', 
    category: 'TECHNOLOGY', 
    categoryColor: 'bg-indigo-600', 
    author: 'By Alex Chloe', 
    date: 'Mar 13, 2024', 
    readTime: '5-min read', 
    imageUrl: '/images/ai.jpg' 
  },
  { 
    title: 'Mindful Living: A Daily Guide', 
    excerpt: 'Embrace minimalism for a serene and streamlined life.', 
    category: 'LIFESTYLE', 
    categoryColor: 'bg-lime-600', 
    author: 'By Jane Doe', 
    date: 'Mar 13, 2024', 
    readTime: '7-min read', 
    imageUrl: '/images/daily.jpg' 
  },
  { 
    title: 'Delicious Pasta Recipes', 
    excerpt: 'Explore traditional Italian fare for a new culinary journey.', 
    category: 'FOODS', 
    categoryColor: 'bg-orange-600', 
    author: 'By Chef Leo', 
    date: 'Nov 11, 2024', 
    readTime: '6-min read', 
    imageUrl: '/images/pasta.jpg' 
  },
  { 
    title: 'Hidden Gems of Europe', 
    excerpt: 'Explore unique European destinations away from the tourist crowds.', 
    category: 'TRAVEL', 
    categoryColor: 'bg-sky-500', 
    author: 'By Mia Jones', 
    date: 'Oct 20, 2024', 
    readTime: '8-min read', 
    imageUrl: '/images/europe.jpg' 
  },
  { 
    title: 'Sustainable Investment Strategies', 
    excerpt: 'Tips for growing your wealth while prioritizing ethical decisions.', 
    category: 'FINANCE', 
    categoryColor: 'bg-emerald-600', 
    author: 'By Tom Smith', 
    date: 'Dec 01, 2024', 
    readTime: '9-min read', 
    imageUrl: '/images/investment.jpg' 
  },
  { 
    title: 'The Future of VR Gaming', 
    excerpt: 'Diving into the hardware and software that define next-gen virtual reality.', 
    category: 'GAMING', 
    categoryColor: 'bg-violet-600', 
    author: 'By Max Power', 
    date: 'Jan 15, 2025', 
    readTime: '10-min read', 
    imageUrl: '/images/vr-gaming.jpg' 
  },
];