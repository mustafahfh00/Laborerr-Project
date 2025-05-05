import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal";
import { BookingModal } from "@/components/modals/booking-modal";

interface FreelancerCardProps {
  id: number;
  name: string;
  title: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  isAvailable: boolean;
}

export function FreelancerCard({
  id,
  name,
  title,
  hourlyRate,
  rating,
  reviewCount,
  location,
  image,
  isAvailable
}: FreelancerCardProps) {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <div className="service-card bg-white rounded-lg overflow-hidden shadow-sm transition duration-300 hover:shadow-md">
        <Link href={`/freelancer/${id}`}>
          <img 
            src={`${image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80`} 
            alt={name} 
            className="w-full h-48 object-cover"
          />
        </Link>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-neutral-600">{title}</p>
            </div>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              isAvailable 
                ? "bg-green-100 text-green-600" 
                : "bg-neutral-100 text-neutral-600"
            )}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          
          <div className="mb-3">
            <Rating rating={rating} showText={true} reviewCount={reviewCount} />
          </div>
          
          <div className="flex items-center mb-4 text-sm text-neutral-600">
            <i className="fas fa-location-dot mr-1"></i>
            <span>{location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold text-neutral-900">{formatPrice(hourlyRate)}</span>
              <span className="text-neutral-600">/hour</span>
            </div>
            {isAvailable ? (
              <Button 
                className="bg-primary text-white hover:bg-blue-600"
                onClick={open}
              >
                Book Now
              </Button>
            ) : (
              <Button 
                className="bg-neutral-200 text-neutral-500"
                disabled
              >
                Currently Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isOpen} 
        onClose={close} 
        freelancer={{
          id,
          name,
          title,
          hourlyRate,
          rating,
          image
        }}
      />
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
