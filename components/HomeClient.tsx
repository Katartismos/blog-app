/**
 * Home Client Component
 * 
 * The client-side controller for the home page. Manages:
 * - Filtering of articles by category
 * - Grid layout logic for "Latest Articles" (asymmetric layout)
 * - GSAP animations for the main content sections
 * - Integration of Header, Footer, Sidebar, and Article Cards
 */

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
  hasMore?: boolean; // Indicates if there are more posts beyond the displayed ones
  topics?: { name: string; count: number }[]; // Category counts for the sidebar
}

const HomeClient: React.FC<HomeClientProps> = ({ featuredArticles, latestArticles, hasMore = false, topics }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  
  // State for the currently active category filter
  const [selectedTag, setSelectedTag] = useState<string>('All');

  /**
   * Filter Logic
   * 
   * Filters the 'latestArticles' array based on the selected category from the sidebar.
   */
  const filteredArticles = selectedTag === 'All' 
    ? latestArticles 
    : latestArticles.filter(article => (article.category || 'TECHNOLOGY').toUpperCase() === selectedTag.toUpperCase());

  /**
   * Layout Mapping
   * 
   * Maps filtered articles into specific slots to create an asymmetric, masonry-style grid.
   * - col1: Large cards
   * - col2_row1: Two small cards
   * - col2_row2: Two small cards
   */
  const articleMap = {
    col1: [filteredArticles[0], filteredArticles[3]].filter(Boolean),
    col2_row1: [filteredArticles[1], filteredArticles[2]].filter(Boolean),
    col2_row2: [filteredArticles[4], filteredArticles[5]].filter(Boolean),
  };

  /**
   * GSAP Animations
   */
  useGSAP(() => {
    // Reveal section titles
    gsap.fromTo(".latest-articles-title", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 1.0, ease: "power2.out", clearProps: "all" }
    );

    gsap.fromTo(".whats-new-title", 
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay: 1.2, ease: "power1.out", clearProps: "all" }
    );

    // Staggered reveal for individual article cards
    gsap.fromTo(".latest-article-card", 
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.08, 
        delay: 1.3, 
        ease: "power2.out", 
        onComplete: () => { 
          // Clear transform props to prevent issues with hover animations defined elsewhere
          gsap.set(".latest-article-card", { clearProps: "transform" }); 
        } 
      }
    );

  }, { scope: mainRef });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
      <Header />

      <main className="max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10" ref={mainRef}>
          
        {/* Featured Section: Displays the top 3 articles */}
        <section className="mb-16">
          <h2 className="sr-only">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, idx) => (
              <FeaturedArticleCard key={article._id || idx} article={article} index={idx} />
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="latest-articles-title text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">EXPLORE OUR LATEST ARTICLES</h3>
            <a href="#" className="latest-articles-title text-amber-700 dark:text-amber-500 hover:text-amber-900 dark:hover:text-amber-400 text-sm font-medium">Join Our Community.</a>
          </div>
        </section>

        {/* What's New Section: Main content grid with sidebar */}
        <section>
          <h3 className="whats-new-title text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 pb-2 border-b-2 border-amber-700 dark:border-amber-600 inline-block">
            {selectedTag === 'All' ? "WHAT'S NEW" : selectedTag.toUpperCase()}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
            {/* Articles Column */}
            <div className="lg:col-span-2 grid gap-8">
                
              {/* Row 1: 1 Large Card, 2 Small Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {articleMap.col1[0] && <LatestArticleCard article={articleMap.col1[0]} isSmallCard={false} />}
                <div className="flex flex-col gap-8 h-full">
                  {articleMap.col2_row1.map((article, idx) => (
                    <LatestArticleCard key={article._id || idx} article={article} isSmallCard={true} />
                  ))}
                </div>
              </div>

              {/* Row 2: 2 Small Cards, 1 Large Card (Inverse of Row 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8 h-full">
                  {articleMap.col2_row2.map((article, idx) => (
                    <LatestArticleCard key={article._id || idx} article={article} isSmallCard={true} />
                  ))}
                </div>
                {articleMap.col1[1] && <LatestArticleCard article={articleMap.col1[1]} isSmallCard={false} />}
              </div>

              {/* Load More Trigger */}
              {(selectedTag === 'All' ? hasMore : (topics?.find(t => t.name.toUpperCase() === selectedTag.toUpperCase())?.count || 0) > 6) && (
                <div className="text-center pt-8">
                  <Link href="/others" className="inline-block latest-articles-title px-6 py-2 border border-gray-300 dark:border-slate-800 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-slate-900 transition cursor-pointer">
                    Load More
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
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
