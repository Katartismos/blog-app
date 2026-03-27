import { notFound } from 'next/navigation';
import Image from 'next/image';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-gray-50 antialiased flex flex-col">
      <Header />
      
      <main className="grow max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10 w-full mt-10">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {post.imageUrl ? (
            <div className="w-full h-64 sm:h-96 relative">
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="100vw"
              />
            </div>
          ) : null}
          
          <div className="p-8 sm:p-12">
            <div className="mb-4">
               <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full text-white ${post.categoryColor}`}>
                 {post.category}
               </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6">{post.title}</h1>
            
            <div className="flex items-center text-gray-500 text-sm mb-10 pb-6 border-b border-gray-100">
              <span className="font-semibold text-amber-700 mr-2">{post.author}</span>
              <span>&bull;</span>
              <span className="mx-2">{post.date}</span>
              <span>&bull;</span>
              <span className="mx-2">{post.readTime}</span>
            </div>
            
            <div className="prose-content max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
