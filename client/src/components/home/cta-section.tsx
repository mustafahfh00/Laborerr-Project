import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const [, navigate] = useLocation();

  return (
    <section className="py-12 bg-gradient-to-r from-primary to-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Skilled Professional?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of freelancers on Laborerr and start earning money by offering your services to clients across Iraq.
        </p>
        <Button 
          className="bg-white text-primary font-medium hover:bg-neutral-100"
          onClick={() => navigate("/auth")}
        >
          Become a Freelancer Today
        </Button>
      </div>
    </section>
  );
}
