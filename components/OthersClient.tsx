'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LatestArticleCard from '@/components/LatestArticle'
import type { Article } from '@/lib/constants'

interface OthersClientProps {
  olderPosts: Article[];
}

const OthersClient: React.FC<OthersClientProps> = ({ olderPosts }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.fromTo(".others-page-title", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.8, ease: "power2.out", clearProps: "all" }
    );

    gsap.fromTo(".older-article-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 1.0, ease: "power2.out", onComplete: () => { gsap.set(".older-article-card", { clearProps: "transform" }); } }
    );
  }, { scope: mainRef });

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased">
      <Header />

      <main className="grow max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10" ref={mainRef}>
        <section className="mb-16">
          <div className="mb-12 border-b border-gray-200 pb-6">
            <h1 className="others-page-title text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">OLDER POSTS</h1>
            <p className="others-page-title text-gray-600">Discover more from our archives.</p>
          </div>

          {olderPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {olderPosts.map((article, idx) => (
                <div key={article._id || idx} className="older-article-card">
                  <LatestArticleCard article={article} isSmallCard={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-500 font-medium">No older posts found.</h3>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OthersClient;
