// src/pages/LaborerPostPage.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LaborerPostForm } from "@/components/Laborer/LaborerPostForm";
import { LaborerPosts } from "@/components/Laborer/LaborerPosts";

export default function LaborerPostPage() {
  const [posts, setPosts] = useState<Array<{
    id: string;
    content: string;
    date: string;
  }>>([]);

  const handlePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            ← Back to Home
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Laborer Post Dashboard</h1>
        
        <LaborerPostForm onPost={handlePost} />
        <LaborerPosts posts={posts} onDelete={handleDelete} />
      </div>
    </div>
  );
}