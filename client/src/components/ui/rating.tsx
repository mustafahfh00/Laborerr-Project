import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  reviewCount?: number;
  className?: string;
}

export function Rating({
  rating,
  max = 5,
  size = "md",
  showText = false,
  reviewCount,
  className
}: RatingProps) {
  // Ensure rating is a valid number and within range
  const validRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(rating, max)) : 0;
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = Math.max(0, max - fullStars - (halfStar ? 1 : 0));

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const starSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center mr-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn("fill-amber-400 text-amber-400", starSizeClasses[size])} />
        ))}
        {halfStar && (
          <span className="relative">
            <Star className={cn("text-neutral-300", starSizeClasses[size])} />
            <Star className={cn("absolute top-0 left-0 overflow-hidden w-[50%] fill-amber-400 text-amber-400", starSizeClasses[size])} />
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn("text-neutral-300", starSizeClasses[size])} />
        ))}
      </div>
      {showText && (
        <span className={cn("text-neutral-600", sizeClasses[size])}>
          {validRating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount} reviews)`}
        </span>
      )}
    </div>
  );
}
