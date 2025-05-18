import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "@/components/payment/payment-form";
import { useToast } from "@/hooks/use-toast";

interface PaymentButtonProps {
  amount: number;
  serviceId?: number;
  freelancerId?: number;
  bookingDate?: Date;
  buttonText?: string;
  onPaymentSuccess?: () => void;
}

export function PaymentButton({
  amount,
  serviceId,
  freelancerId,
  bookingDate,
  buttonText = "Make Payment",
  onPaymentSuccess,
}: PaymentButtonProps) {
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const { toast } = useToast();

  const handlePaymentSuccess = () => {
    toast({
      title: "Booking confirmed",
      description: "Your booking has been confirmed successfully.",
    });
    onPaymentSuccess?.();
  };

  return (
    <>
      <Button 
        onClick={() => setIsPaymentFormOpen(true)}
        className="bg-primary text-white hover:bg-primary/90"
      >
        {buttonText}
      </Button>

      <PaymentForm
        isOpen={isPaymentFormOpen}
        onClose={() => setIsPaymentFormOpen(false)}
        amount={amount}
        serviceId={serviceId}
        freelancerId={freelancerId}
        bookingDate={bookingDate}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}