'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createPost } from '@/app/actions/post';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TiptapEditor from '@/components/TiptapEditor';

export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Strip HTML tags to get plain text for length validation
    const plainText = contentHtml.replace(/<[^>]+>/g, '').trim();

    if (plainText.length < 30) {
      setError('Content must be at least 30 characters long.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;

    if (!title.trim()) {
      setError('Title is a required field.');
      setLoading(false);
      return;
    }

    // Inject the Tiptap HTML output as the 'content' field
    formData.set('content', contentHtml);

    try {
      const response = await createPost(formData);

      if (response?.error) {
        setError(response.error);
        setLoading(false);
      } else if (response?.success) {
        router.push('/');
      }
    } catch (err: any) {
      console.error("Action error:", err);
      setError(err.message || 'An unexpected error occurred while communicating with the server. The image might be too large (Max: 10MB)');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 antialiased flex flex-col">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition duration-150 text-black"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition duration-150 bg-white text-gray-500"
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
                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload Image *
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition duration-150 text-black file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">
                Short Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition duration-150 resize-y text-black"
                placeholder="Brief summary of your post..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Content * <span className="text-gray-400 font-normal text-xs">(min. 30 characters)</span>
              </label>
              <TiptapEditor onChange={setContentHtml} />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center py-3 px-8 rounded-full text-white font-semibold shadow-md transition duration-200 cursor-pointer ${
                  loading 
                    ? 'bg-amber-500 cursor-not-allowed' 
                    : 'bg-amber-700 hover:bg-amber-800 hover:shadow-lg'
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
