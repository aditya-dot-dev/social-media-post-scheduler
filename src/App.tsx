import { useState, useMemo } from 'react';
import { mockPosts } from './data/mockPosts';
import type { Post } from './types/post';
import { PostQueue } from './components/PostQueue';
import { FilterBar } from './components/FilterBar';
import { usePostFilters } from './hooks/usePostFilters';

export default function App() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const { search, platform, status, setSearch, setPlatform, setStatus, resetFilters } = usePostFilters();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Text search
      const matchesSearch = search.trim() === '' ||
        post.content.toLowerCase().includes(search.toLowerCase());

      // 2. Platform filter
      const matchesPlatform = platform === 'all' ||
        post.platforms.includes(platform);

      // 3. Status filter
      const matchesStatus = status === 'all' ||
        post.status === status;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [posts, search, platform, status]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Post Scheduler</h1>
              <p className="text-xs text-slate-500">Manage & queue social broadcasts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <FilterBar
          search={search}
          platform={platform}
          status={status}
          onSearchChange={setSearch}
          onPlatformChange={setPlatform}
          onStatusChange={setStatus}
          onReset={resetFilters}
          totalResults={filteredPosts.length}
        />

        <PostQueue
          posts={filteredPosts}
          onRetry={(id) => console.log('Retry placeholder:', id)}
          retryingPostIds={[]}
        />
      </main>
    </div>
  );
}