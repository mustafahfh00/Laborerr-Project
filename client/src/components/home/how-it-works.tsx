import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">How Laborerr Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
              <i className="fas fa-search text-2xl text-primary"></i>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">1</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search for a Service</h3>
            <p className="text-neutral-600">Browse through our categories or search for a specific service you need help with.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
              <i className="fas fa-user-check text-2xl text-primary"></i>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">2</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose a Freelancer</h3>
            <p className="text-neutral-600">Review profiles, check ratings, and select the best freelancer for your needs.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
              <i className="fas fa-calendar-check text-2xl text-primary"></i>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">3</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Book and Pay</h3>
            <p className="text-neutral-600">Schedule the service, make the payment, and get your job done by a professional.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/categories">
            <Button className="bg-primary text-white hover:bg-blue-600">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
