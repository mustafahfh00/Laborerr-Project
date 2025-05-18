import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentButton } from "@/components/payment/payment-button";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  freelancer: {
    id: number;
    name: string;
    title: string;
    hourlyRate: number;
    rating: number;
    image: string;
  };
  onBookingSuccess?: () => void;
}

export function BookingCard({ freelancer, onBookingSuccess }: BookingCardProps) {
  const [hours, setHours] = useState(2);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const totalAmount = freelancer.hourlyRate * hours;
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Book {freelancer.name}</CardTitle>
        <CardDescription>{freelancer.title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Service Rate:</div>
          <div>${freelancer.hourlyRate.toFixed(2)}/hour</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Duration:</div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setHours(Math.max(1, hours - 1))}
            >
              -
            </Button>
            <span>{hours} hour{hours !== 1 ? 's' : ''}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setHours(hours + 1)}
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center font-medium text-lg">
          <div>Total:</div>
          <div>${totalAmount.toFixed(2)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {/* This component will open the payment form when clicked */}
        <PaymentButton 
          amount={totalAmount} 
          freelancerId={freelancer.id}
          bookingDate={selectedDate || undefined}
          buttonText="Book & Pay Now"
          onPaymentSuccess={onBookingSuccess}
        />
      </CardFooter>
    </Card>
  );
}