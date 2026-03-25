'use client'

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

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
  onSelectTag?: (tag: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, selectedTag = 'All', onSelectTag }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    // Animation: Sidebar slides in from the right after the featured section loads
    if (!sidebarRef.current) return;
    gsap.from(sidebarRef.current.children, {
      x: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2, // Stagger elements inside the sidebar (topics, tags, newsletter)
      delay: 1.2, 
      ease: "power2.out"
    });
  }, { scope: sidebarRef });

  return (
    <div className="space-y-8 p-4 md:p-0" ref={sidebarRef}>
      {/* Explore Topics */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">EXPLORE TOPICS</h4>
        <ul className="space-y-3">
          {(topics || FALLBACK_TOPICS).map((topic, index) => (
            <li key={index} className="flex justify-between items-center text-sm text-gray-600 hover:text-indigo-600 transition cursor-pointer">
              <span>{topic.name}</span>
              <span className="text-xs font-medium text-gray-400">({topic.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tag Cloud */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tag Cloud</h4>
        <div className="flex flex-wrap gap-2">
          {['All', ...(topics || FALLBACK_TOPICS).map(t => t.name)].map((tag, index) => (
            <span 
              key={index}
              onClick={() => onSelectTag?.(tag)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition cursor-pointer ${
                selectedTag === tag 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'border-gray-300 text-gray-600 hover:bg-indigo-50'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-2">NEVER MISS A STORY!</h4>
        <p className="text-sm text-gray-600 mb-4">Subscribe to our weekly newsletter.</p>
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black"
        />
        <button className="mt-3 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-indigo-800 active:bg-indigo-700 transition">
            SUBSCRIBE
        </button>
      </div>
    </div>
  );
};

export default Sidebar