// src/components/laborer/buttons/LaborerPostButton.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Make sure you have this utility

interface LaborerPostButtonProps {
  className?: string;
}

export function LaborerPostButton({ className }: LaborerPostButtonProps) {
  return (
    <Link href="/laborer-post">
      <Button 
        variant="default" 
        className={cn(
          "ml-4 bg-primary hover:bg-primary-dark text-white",
          className
        )}
      >
        Post as Laborer
      </Button>
    </Link>
  );
}