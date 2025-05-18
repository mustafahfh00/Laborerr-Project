// src/components/laborer/LaborerPosts.tsx
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  content: string;
  date: string;
}

export function LaborerPosts({ posts, onDelete }: { 
  posts: Post[];
  onDelete: (id: string) => void 
}) {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="font-medium text-lg">Your Posts</h3>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <p className="text-sm">{post.content}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {new Date(post.date).toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}