import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [, navigate] = useLocation();
  
  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect freelancer for your next project</h1>
            <p className="text-lg mb-8">Skilled professionals available across Iraq to help with your needs</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-white text-primary font-medium hover:bg-neutral-100"
                onClick={() => navigate("/categories")}
              >
                Find a Service
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-primary"
                onClick={() => navigate("/auth")}
              >
                Become a Freelancer
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="People working together" 
              className="rounded-lg shadow-xl w-full object-cover h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
