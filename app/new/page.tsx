'use client'

import { useState } from 'react';
import { createPost } from '@/app/actions/post';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required fields.');
      setLoading(false);
      return;
    }

    const response = await createPost(formData);
    
    if (response?.error) {
      setError(response.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col">
      <Header />
      
      <main className="grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-100">Create a New Post</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black"
                placeholder="Enter a captivating title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white text-gray-500"
                >
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="FOODS">Foods</option>
                  <option value="LIFESTYLE">Lifestyle</option>
                  <option value="FINANCE">Finance</option>
                  <option value="GAMING">Gaming</option>
                </select>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">
                Short Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y text-black"
                placeholder="Brief summary of your post..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y text-black"
                placeholder="Write your blog post content here... (HTML tags are supported)"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center py-3 px-8 rounded-full text-white font-semibold shadow-md transition duration-200 cursor-pointer ${
                  loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
