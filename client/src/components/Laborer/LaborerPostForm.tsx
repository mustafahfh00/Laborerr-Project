// src/components/laborer/LaborerPostForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function LaborerPostForm({ onPost }: { onPost: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="post-content">Create a Post</Label>
        <Textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What services are you offering today?"
          rows={4}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Post
      </Button>
    </form>
  );
}