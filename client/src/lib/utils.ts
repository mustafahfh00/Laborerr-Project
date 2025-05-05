import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function getStarRating(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return {
    fullStars,
    halfStar,
    emptyStars
  };
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const categoryIcons: Record<string, string> = {
  "Home Repair": "fa-hammer",
  "Design": "fa-paint-roller",
  "Programming": "fa-code",
  "Delivery": "fa-truck",
  "Electrical": "fa-lightbulb",
  "Plumbing": "fa-wrench",
  "Cleaning": "fa-broom",
  "Gardening": "fa-seedling",
  "Automotive": "fa-car"
};
