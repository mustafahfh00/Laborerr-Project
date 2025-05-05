import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { categories as staticCategories } from "@/data/categories";

export function PopularCategories() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: Infinity,
  });

  // Use API data if available, otherwise use static data
  const categories = categoriesData || staticCategories;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Service Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="category-card bg-neutral-100 rounded-xl p-6 flex flex-col items-center justify-center transition duration-300 hover:shadow-md"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className={`fas ${category.icon} text-2xl text-primary`}></i>
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-sm text-neutral-500 text-center mt-1">{category.servicesCount} Services</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
