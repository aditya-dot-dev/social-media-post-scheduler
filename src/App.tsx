import { useState } from 'react';
import { mockPosts } from './data/mockPosts';
import { PostQueue } from './components/PostQueue';

export default function App() {
  const [posts] = useState(mockPosts);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Social Media Post Queue</h1>
      <PostQueue
        posts={posts}
        onRetry={(id) => console.log('Retry clicked:', id)}
        retryingPostIds={[]}
      />
    </div>
  );
}