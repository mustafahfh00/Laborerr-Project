import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoryNavbar } from "@/components/shared/category-navbar";

export function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary font-bold text-2xl">Laborerr</span>
        </Link>
        
        {/* Search - Desktop */}
        <div className="hidden md:flex relative flex-1 mx-8">
          <Input
            type="text"
            placeholder="Search for services..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-neutral-500">
            <Search size={18} />
          </div>
        </div>
        
        {/* Search - Mobile */}
        {isSearchExpanded && (
          <div className="absolute inset-0 bg-white flex items-center p-4 md:hidden z-50">
            <Input
              type="text"
              placeholder="Search for services..."
              className="w-full rounded-lg border border-neutral-300"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsSearchExpanded(false)}
            >
              <X size={24} />
            </Button>
          </div>
        )}
        
        {/* Navigation - Desktop */}
        <nav className="flex items-center space-x-6">
          <Link href="/how-it-works" className="hidden md:block text-neutral-700 hover:text-primary">
            How it Works
          </Link>
          <Link href="/categories" className="hidden md:block text-neutral-700 hover:text-primary">
            Browse Services
          </Link>
          <Button 
            variant="outline" 
            className="hidden md:block border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => navigate("/auth")}
          >
            Login
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-blue-600"
            onClick={() => navigate("/auth")}
          >
            Sign Up
          </Button>
          
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchExpanded(true)}
          >
            <Search size={24} />
          </Button>
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/how-it-works" className="text-neutral-700 hover:text-primary py-2">
                  How it Works
                </Link>
                <Link href="/categories" className="text-neutral-700 hover:text-primary py-2">
                  Browse Services
                </Link>
                <Link href="/auth" className="text-neutral-700 hover:text-primary py-2">
                  Login
                </Link>
                <Link href="/auth" className="text-neutral-700 hover:text-primary py-2">
                  Sign Up
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
      
      {/* Categories Navigation */}
      <CategoryNavbar />
    </header>
  );
}
