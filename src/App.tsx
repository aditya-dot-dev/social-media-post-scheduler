import { useState, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
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
  const [retryingPostIds, setRetryingPostIds] = useState<string[]>([]);
  const { search, platform, status, setSearch, setPlatform, setStatus, resetFilters } = usePostFilters();

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'status'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      status: 'scheduled',
    };
    setPosts((prev) => [newPost, ...prev]);
    toast.success('Post scheduled successfully!');
  };

  const handleRetryPost = async (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost || targetPost.status !== 'failed') return;

    // Snapshot of the original post for rollback
    const originalPost = { ...targetPost };

    // Mark post as retrying
    setRetryingPostIds((prev) => [...prev, postId]);

    // Optimistic update: mark as scheduled and clear error
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, status: 'scheduled', errorMessage: undefined }
          : p
      )
    );

    try {
      // Simulate 1-second network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate 20% failure rate
      const hasFailed = Math.random() < 0.20;

      if (hasFailed) {
        // Rollback optimistic update
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? originalPost : p))
        );
        toast.error('Failed to retry post: Network timeout. Rolled back changes.');
      } else {
        toast.success('Post re-queued successfully!');
      }
    } catch {
      // Rollback on unexpected error
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? originalPost : p))
      );
      toast.error('Failed to retry post: Network timeout. Rolled back changes.');
    } finally {
      setRetryingPostIds((prev) => prev.filter((id) => id !== postId));
    }
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
      <Toaster position="top-right" richColors />

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
            type="button"
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
          onRetry={handleRetryPost}
          retryingPostIds={retryingPostIds}
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