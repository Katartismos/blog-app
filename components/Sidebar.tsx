/**
 * Sidebar Component
 * 
 * Displays auxiliary content alongside the main blog feed, including:
 * - Topic list with post counts
 * - Category tag cloud (interactive filters)
 * - Newsletter subscription form
 * - GSAP animations for entrance
 */

'use client'

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Default topics to display if no data is passed from the server
const FALLBACK_TOPICS = [
  { name: 'Technology', count: 0 },
  { name: 'Lifestyle', count: 0 },
  { name: 'Travel', count: 0 },
  { name: 'Foods', count: 0 },
  { name: 'Photography', count: 0 },
];

interface TopicType {
  name: string;
  count: number;
}

interface SidebarProps {
  topics?: TopicType[];
  selectedTag?: string;
  onSelectTag?: (tag: string) => void; // Callback when a category tag is clicked
}

const Sidebar: React.FC<SidebarProps> = ({ topics, selectedTag = 'All', onSelectTag }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  /**
   * GSAP Animation: Sidebar sections slide in from the right.
   */
  useGSAP(() => {
    if (!sidebarRef.current) return;
    gsap.from(sidebarRef.current.children, {
      x: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2, // Reveals topics, then tags, then newsletter one after another
      delay: 1.2, 
      ease: "power2.out"
    });
  }, { scope: sidebarRef });

  return (
    <div className="space-y-8 p-4 md:p-0" ref={sidebarRef}>
      {/* Section 1: Explore Topics (List View) */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800/60 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-slate-850 pb-2">EXPLORE TOPICS</h4>
        <ul className="space-y-3">
          {(topics || FALLBACK_TOPICS).map((topic, index) => (
            <li key={index} className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition cursor-pointer">
              <span>{topic.name}</span>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">({topic.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: Categories (Tag Cloud View) */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800/60 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-slate-850 pb-2">CATEGORIES</h4>
        <div className="flex flex-wrap gap-2">
          {['All', ...(topics || FALLBACK_TOPICS).map(t => t.name)].map((tag, index) => (
            <span 
              key={index}
              onClick={() => onSelectTag?.(tag)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition cursor-pointer ${
                selectedTag === tag 
                  ? 'bg-amber-700 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-500' 
                  : 'border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-slate-800 dark:hover:text-amber-500'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Section 3: Newsletter Signup */}
      <div className="bg-amber-50 dark:bg-amber-950/15 border dark:border-amber-900/20 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 dark:text-amber-600 mb-2">NEVER MISS A STORY!</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Subscribe to our weekly newsletter.</p>
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm text-black dark:text-white bg-white dark:bg-slate-900"
        />
        <button className="mt-3 w-full py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-amber-800 active:bg-amber-700 transition">
            SUBSCRIBE
        </button>
      </div>
    </div>
  );
};

export default Sidebar