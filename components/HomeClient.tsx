'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeaturedArticleCard from '@/components/FeaturedArticle'
import LatestArticleCard from '@/components/LatestArticle'
import Sidebar from '@/components/Sidebar'
import type { Article } from '@/lib/constants'

interface HomeClientProps {
  featuredArticles: Article[];
  latestArticles: Article[];
  hasMore?: boolean;
  topics?: { name: string; count: number }[];
}

const HomeClient: React.FC<HomeClientProps> = ({ featuredArticles, latestArticles, hasMore = false, topics }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredArticles = selectedTag === 'All' 
    ? latestArticles 
    : latestArticles.filter(article => (article.category || 'TECHNOLOGY').toUpperCase() === selectedTag.toUpperCase());

  // Safe mapping for layout using indexes instead of IDs
  const articleMap = {
    col1: [filteredArticles[0], filteredArticles[3]].filter(Boolean),
    col2_row1: [filteredArticles[1], filteredArticles[2]].filter(Boolean),
    col2_row2: [filteredArticles[4], filteredArticles[5]].filter(Boolean),
  };

  useGSAP(() => {
    gsap.fromTo(".latest-articles-title", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 1.0, ease: "power2.out", clearProps: "all" }
    );

    gsap.fromTo(".whats-new-title", 
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay: 1.2, ease: "power1.out", clearProps: "all" }
    );

    gsap.fromTo(".latest-article-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 1.3, ease: "power2.out", onComplete: () => { gsap.set(".latest-article-card", { clearProps: "transform" }); } }
    );

  }, { scope: mainRef });

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased">
      <Header />

      <main className="max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10" ref={mainRef}>
          
        <section className="mb-16">
          <h2 className="sr-only">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, idx) => (
              <FeaturedArticleCard key={article._id || idx} article={article} index={idx} />
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="latest-articles-title text-xl font-bold text-gray-800 mb-2">EXPLORE OUR LATEST ARTICLES</h3>
            <a href="#" className="latest-articles-title text-indigo-600 hover:text-indigo-800 text-sm font-medium">Join Our Community.</a>
          </div>
        </section>

        <section>
          <h3 className="whats-new-title text-2xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-indigo-600 inline-block">
            {selectedTag === 'All' ? "WHAT'S NEW" : selectedTag.toUpperCase()}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
            <div className="lg:col-span-2 grid gap-8">
                
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {articleMap.col1[0] && <LatestArticleCard article={articleMap.col1[0]} isSmallCard={false} />}
                <div className="flex flex-col gap-8 h-full">
                  {articleMap.col2_row1.map((article, idx) => (
                    <LatestArticleCard key={article._id || idx} article={article} isSmallCard={true} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8 h-full">
                  {articleMap.col2_row2.map((article, idx) => (
                    <LatestArticleCard key={article._id || idx} article={article} isSmallCard={true} />
                  ))}
                </div>
                {articleMap.col1[1] && <LatestArticleCard article={articleMap.col1[1]} isSmallCard={false} />}
              </div>

              {(selectedTag === 'All' ? hasMore : (topics?.find(t => t.name.toUpperCase() === selectedTag.toUpperCase())?.count || 0) > 6) && (
                <div className="text-center pt-8">
                  <Link href="/others" className="inline-block latest-articles-title px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition cursor-pointer">
                    Load More
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Sidebar topics={topics} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeClient;
