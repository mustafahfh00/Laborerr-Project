import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FreelancerCard } from "@/components/shared/freelancer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriceRange } from "@/components/ui/price-range";
import { categories as staticCategories } from "@/data/categories";
import { freelancers as staticFreelancers } from "@/data/freelancers";

type SortOption = "popular" | "rating" | "price-low" | "price-high";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:id");
  const categoryId = params ? parseInt(params.id) : 0;
  
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [rating, setRating] = useState<string>("any");
  const [location, setLocation] = useState<string>("all");

  // Fetch category data
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId,
  });

  // Fetch freelancers by category
  const { data: categoryFreelancersData, isLoading: isLoadingFreelancers } = useQuery({
    queryKey: ["/api/freelancers", { categoryId }],
    enabled: !!categoryId,
  });

  // Use API data if available, otherwise use static data
  const category = categoryData || staticCategories.find(c => c.id === categoryId);
  const allFreelancers = categoryFreelancersData || staticFreelancers.filter(f => f.categoryId === categoryId);

  // Apply filters and sorting
  const filteredFreelancers = (Array.isArray(allFreelancers) ? allFreelancers : [])
    .filter((freelancer) => 
      (freelancer.hourlyRate >= priceRange[0] && freelancer.hourlyRate <= priceRange[1]) &&
      (rating === "any" || (rating !== "any" && freelancer.rating >= parseInt(rating))) &&
      (location === "all" || (location !== "all" && freelancer.location.toLowerCase().includes(location.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.hourlyRate - b.hourlyRate;
        case "price-high":
          return b.hourlyRate - a.hourlyRate;
        case "popular":
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setRating("any");
    setLocation("all");
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  if (isLoadingCategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-12 w-48 bg-neutral-200 rounded-md mx-auto mb-4"></div>
            <div className="h-6 w-64 bg-neutral-200 rounded-md mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-neutral-600 mb-6">The category you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-primary text-white" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`fas ${category.icon} text-3xl text-primary`}></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-neutral-600">Find the best {category.name.toLowerCase()} professionals in your area</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{category.name} Freelancers</h2>
            
            {/* Sorting Options */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-600 hidden md:inline">Sort by:</span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="text-sm border border-neutral-300 rounded-lg py-2 px-3 bg-white w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popularity</SelectItem>
                  <SelectItem value="rating">Rating: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <Label className="block text-sm font-medium text-neutral-700 mb-1">Price Range</Label>
                <PriceRange 
                  min={0} 
                  max={100} 
                  defaultValue={priceRange} 
                  onValueChange={setPriceRange}
                />
              </div>
              
              <div className="w-full md:w-auto">
                <Label className="block text-sm font-medium text-neutral-700 mb-1">Rating</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto">
                <Label className="block text-sm font-medium text-neutral-700 mb-1">City/Region</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Baghdad">Baghdad</SelectItem>
                    <SelectItem value="Erbil">Erbil</SelectItem>
                    <SelectItem value="Basra">Basra</SelectItem>
                    <SelectItem value="Mosul">Mosul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto flex items-end">
                <Button 
                  variant="outline" 
                  className="text-neutral-600 border border-neutral-300 hover:bg-neutral-100"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Freelancer Grid */}
          {isLoadingFreelancers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : filteredFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <FreelancerCard
                  key={freelancer.id}
                  id={freelancer.id}
                  name={freelancer.name}
                  title={freelancer.title}
                  hourlyRate={freelancer.hourlyRate}
                  rating={freelancer.rating}
                  reviewCount={freelancer.reviewCount}
                  location={freelancer.location}
                  image={freelancer.image}
                  isAvailable={freelancer.isAvailable}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${category.icon} text-xl text-neutral-400`}></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No Freelancers Found</h3>
              <p className="text-neutral-600 mb-6">No freelancers match your filters in this category.</p>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredFreelancers.length > 0 && (
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <i className="fas fa-chevron-left"></i>
                </Button>
                <Button variant="default" className="px-4">1</Button>
                <Button variant="outline" className="px-4">2</Button>
                <Button variant="outline" className="px-4">3</Button>
                <span className="px-3 py-2">...</span>
                <Button variant="outline" className="px-4">10</Button>
                <Button variant="outline" size="icon">
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
