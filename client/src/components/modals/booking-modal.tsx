import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: {
    id: number;
    name: string;
    title: string;
    hourlyRate: number;
    rating: number;
    image: string;
  };
}

export function BookingModal({ isOpen, onClose, freelancer }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [hours, setHours] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const estimatedHours = parseInt(hours);
  const serviceFee = Math.round(freelancer.hourlyRate * 0.1);
  const totalPrice = (freelancer.hourlyRate * estimatedHours) + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !address || !details) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would use the actual user ID from auth context
      const bookingDate = new Date(`${date}T${time}`);
      
      // This would use actual user ID in a real app with authentication
      const userId = 7; // Placeholder for demo
      
      await apiRequest("POST", "/api/bookings", {
        freelancerId: freelancer.id,
        userId,
        date: bookingDate.toISOString(),
        address,
        details,
        estimatedHours,
        totalPrice,
        status: "pending"
      });
      
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      toast({
        title: "Booking Submitted",
        description: "Your booking has been submitted successfully."
      });
      
      onClose();
      
      // Redirect to a confirmation page or show payment modal
      // For now, we'll just close the modal
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your booking.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book Service</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center mb-6">
          <img 
            src={`${freelancer.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80`}
            alt={freelancer.name} 
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold">{freelancer.name}</h4>
            <p className="text-neutral-600">{freelancer.title}</p>
            <Rating rating={freelancer.rating} size="sm" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={time} onValueChange={setTime} required>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                placeholder="Enter your address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="details">Service Details</Label>
              <Textarea 
                id="details" 
                placeholder="Describe what you need help with" 
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
            
            <div className="border-t border-neutral-200 pt-4 mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Service Rate</span>
                <span className="font-semibold">{formatPrice(freelancer.hourlyRate)}/hour</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Estimated Hours</span>
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Service Fee</span>
                <span className="font-semibold">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-blue-600 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
