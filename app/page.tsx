'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeaturedArticleCard from '@/components/FeaturedArticle'
import LatestArticleCard from '@/components/LatestArticle'
import Sidebar from '@/components/Sidebar'

import { featuredArticles, latestArticles } from '@/lib/constants'

const articleMap = {
  col1: [latestArticles[0], latestArticles[3]],
  col2_row1: [latestArticles[1], latestArticles[2]],
  col2_row2: [latestArticles[4], latestArticles[5]],
};


const Page = () => {
  const mainRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    // Animation for the "Explore Our Latest Articles" text
    gsap.from(".latest-articles-title", {
      y: 20,
      opacity: 0,
      duration: 0.7,
      delay: 1.0, 
      ease: "power2.out"
    });

    // Animation for the "WHAT'S NEW" section title
    gsap.from(".whats-new-title", {
      x: -20,
      opacity: 0,
      duration: 0.6,
      delay: 1.2, 
      ease: "power1.out"
    });

    // Staggered animation for all latest articles
    gsap.fromTo(".latest-article-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 1.3, ease: "power2.out" }
    );

  }, { scope: mainRef });

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased">
      {/* Header animation handled internally */}
      <Header />

      <main className="max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10" ref={mainRef}>
          
        {/* Featured Articles Section (Cards animated internally and staggered here) */}
        <section className="mb-16">
          <h2 className="sr-only">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map(article => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="latest-articles-title text-xl font-bold text-gray-800 mb-2">EXPLORE OUR LATEST ARTICLES</h3>
            <a href="#" className="latest-articles-title text-indigo-600 hover:text-indigo-800 text-sm font-medium">Join Our Community.</a>
          </div>
        </section>

        {/* What's New & Main Content Grid */}
        <section>
          <h3 className="whats-new-title text-2xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-indigo-600 inline-block">WHAT'S NEW</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
            {/* 1. Main Article Content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-8">
                
              {/* Row 1 (Large + Two Small) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <LatestArticleCard article={articleMap.col1[0]} /> 
                <div className="space-y-8">
                  {articleMap.col2_row1.map(article => (
                    <LatestArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>

              {/* Row 2 (Large + Two Small) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {articleMap.col2_row2.map(article => (
                    <LatestArticleCard key={article.id} article={article} />
                  ))}
                </div>
                <LatestArticleCard article={articleMap.col1[1]} /> 
              </div>

              {/* Load More Button */}
              <div className="text-center pt-8">
                <button className="latest-articles-title px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  Load More
                </button>
              </div>
            </div>

            {/* 2. Sidebar (1/3 width on desktop) */}
            <div className="lg:col-span-1">
              {/* Sidebar animation handled internally */}
              <Sidebar />
            </div>
          </div>
        </section>
      </main>

      {/* Footer animation handled internally */}
      <Footer />
    </div>
  );
};

export default Page;