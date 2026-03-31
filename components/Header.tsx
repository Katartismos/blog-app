'use client'

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, PenSquare, ChevronDown, Newspaper, Menu, X, User2 } from 'lucide-react'; 
import { useSession, signIn, signOut } from 'next-auth/react'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const headerRef = useRef(null);
  const logoRef = useRef(null);

  useGSAP(() => {
    // Animation for Header container (fades down slightly)
    gsap.fromTo(headerRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
    );
    
    // Stagger the logo and nav items for a professional feel
    gsap.fromTo(logoRef.current, 
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, delay: 0.3, clearProps: "all" }
    );

    gsap.fromTo(".nav-item", 
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.5, ease: "back.out(1.7)", clearProps: "all" }
    );

  }, { scope: headerRef });


  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-10" ref={headerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" ref={logoRef}>
            <Newspaper className="text-amber-700" size={28} />
            <span className="text-2xl font-bold text-gray-800">K-BLOG</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="nav-item text-sm font-semibold text-gray-600 hover:text-amber-700 transition flex items-center"
              >
                {item.name}
              </Link>
            ))}
            {/* Search Bar */}
            <div className="nav-item relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 text-sm text-black border border-gray-200 rounded-full focus:outline-none focus:ring-amber-700 focus:border-amber-700 w-40"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </nav>

          {/* Actions & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {status === "authenticated" && (
              <Link href="/new" className="nav-item hidden sm:flex items-center space-x-2 bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-amber-800 transition">
                <PenSquare size={16} />
                <span>Create a Post</span>
              </Link>
            )}

            {/* User Avatar & Dropdown */}
            <div className="relative nav-item">
              <div 
                className="h-10 w-10 bg-gray-100 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border border-gray-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {status === "authenticated" && session?.user?.image ? (
                  <Image src={session.user.image} alt="User Avatar" width={40} height={40} className="object-cover" />
                ) : (
                  <User2 size={20} className="text-gray-400" />
                )}
              </div>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                  {status === "authenticated" ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-semibold truncate">{session.user?.name || "User"}</p>
                      </div>
                      <button 
                        onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-semibold">Guest</p>
                      </div>
                      <button 
                        onClick={() => { signIn('google'); setIsUserMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        Sign in with Google
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full w-full bg-white shadow-xl p-4 transition-all duration-300">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 border-t pt-4">
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {status === "authenticated" && (
              <Link href="/new" className="mt-2 w-full flex justify-center items-center space-x-2 bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-full" onClick={() => setIsMenuOpen(false)}>
                <PenSquare size={16} />
                <span>Create a Post</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header