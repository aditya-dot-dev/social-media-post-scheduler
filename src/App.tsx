import { useState, useMemo } from 'react';
import { mockPosts } from './data/mockPosts';
import type { Post } from './types/post';
import { PostQueue } from './components/PostQueue';
import { FilterBar } from './components/FilterBar';
import { PostComposerModal } from './components/PostComposerModal';
import { usePostFilters } from './hooks/usePostFilters';
import { Plus } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const { search, platform, status, setSearch, setPlatform, setStatus, resetFilters } = usePostFilters();

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'status'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      status: 'scheduled',
    };
    // Prepend or add to posts array
    setPosts((prev) => [newPost, ...prev]);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = search.trim() === '' ||
        post.content.toLowerCase().includes(search.toLowerCase());
      const matchesPlatform = platform === 'all' ||
        post.platforms.includes(platform);
      const matchesStatus = status === 'all' ||
        post.status === status;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [posts, search, platform, status]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
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

          <button
            onClick={() => setIsComposerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
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

      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSchedulePost={handleCreatePost}
      />
    </div>
  );
}