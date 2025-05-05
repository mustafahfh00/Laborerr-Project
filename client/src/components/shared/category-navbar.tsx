import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { useQuery } from "@tanstack/react-query";

export function CategoryNavbar() {
  const [isCategoryRoute, params] = useRoute("/category/:id");
  const activeCategoryId = isCategoryRoute ? parseInt(params?.id || "0") : 0;

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: Infinity,
  });

  // Use the API data if available, otherwise fall back to static data
  const displayCategories = categoryData || categories;

  return (
    <div className="border-t border-neutral-200 overflow-x-auto">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 py-3 text-sm whitespace-nowrap">
          {displayCategories.map((category) => (
            <li key={category.id}>
              <Link 
                href={`/category/${category.id}`}
                className={cn(
                  "flex flex-col items-center pb-1",
                  activeCategoryId === category.id 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-neutral-600 hover:text-primary"
                )}
              >
                <i className={`fas ${category.icon} mb-1`}></i>
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
