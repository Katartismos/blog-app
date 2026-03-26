'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LatestArticleCard from '@/components/LatestArticle'
import type { Article } from '@/lib/constants'

const FALLBACK_TOPICS = [
  { name: 'Technology', count: 0 },
  { name: 'Lifestyle', count: 0 },
  { name: 'Travel', count: 0 },
  { name: 'Foods', count: 0 },
  { name: 'Photography', count: 0 },
];

interface OthersClientProps {
  olderPosts: Article[];
  topics?: { name: string; count: number }[];
}

const OthersClient: React.FC<OthersClientProps> = ({ olderPosts, topics }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredPosts = selectedTag === 'All'
    ? olderPosts
    : olderPosts.filter(article => (article.category || 'TECHNOLOGY').toUpperCase() === selectedTag.toUpperCase());

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
    <div className="min-h-screen bg-gray-50 antialiased">
      <Header />

      <main className="grow max-w-[90%] mx-auto px-4 sm:px-2 lg:px-20 py-10" ref={mainRef}>
        <section className="mb-16">
          <div className="mb-12 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="others-page-title text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">OLDER POSTS</h1>
              <p className="others-page-title text-gray-600">Discover more from our archives.</p>
            </div>

            {/* Horizontal Tag Cloud */}
            <div className="others-page-title flex flex-wrap gap-2">
              {['All', ...(topics || FALLBACK_TOPICS).map(t => t.name)].map((tag, idx) => (
                <span 
                  key={idx}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition cursor-pointer ${
                    selectedTag === tag 
                      ? 'bg-amber-700 text-white border-amber-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((article, idx) => (
                <div key={article._id || idx} className="older-article-card">
                  <LatestArticleCard article={article} isSmallCard={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-4xl text-gray-500 font-medium pt-30">No older posts found.</h3>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OthersClient;
