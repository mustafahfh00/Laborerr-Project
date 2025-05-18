// src/components/payment/PaymentModal.tsx
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  bookingId: number | null;
  onPaymentSuccess: () => void;
  bookingDetails: {
    freelancerName: string;
    service: string;
    date: string;
    time: string;
  };
}

export function PaymentModal({
  isOpen,
  onClose,
  totalPrice,
  onPaymentSuccess,
  bookingDetails
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Payment Successful",
        description: `Your payment of ${formatPrice(totalPrice)} has been processed.`
      });
      
      onPaymentSuccess();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Booking Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Service:</span>
            <span>{bookingDetails.service}</span>
            <span className="text-gray-600">With:</span>
            <span>{bookingDetails.freelancerName}</span>
            <span className="text-gray-600">Date:</span>
            <span>{bookingDetails.date} at {bookingDetails.time}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={paymentMethod === "credit-card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("credit-card")}
                >
                  Credit Card
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  PayPal
                </Button>
              </div>
            </div>
            
            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === "paypal" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p>You will be redirected to PayPal to complete your payment</p>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark mt-6"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}