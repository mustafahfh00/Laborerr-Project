import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Banknote, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Payment form schema
const paymentFormSchema = z.object({
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"], {
    required_error: "You need to select a payment method",
  }),
  cardNumber: z.string().optional()
    .refine(val => !val || val.replace(/\s/g, '').length === 16, {
      message: "Card number must be 16 digits",
    }),
  cardName: z.string().optional()
    .refine(val => !val || val.length > 0, {
      message: "Cardholder name is required for credit card payment",
    }),
  expiryDate: z.string().optional()
    .refine(val => !val || /^\d{2}\/\d{2}$/.test(val), {
      message: "Expiry date must be in format MM/YY",
    }),
  cvv: z.string().optional()
    .refine(val => !val || (val.length >= 3 && val.length <= 4), {
      message: "CVV must be 3 or 4 digits",
    }),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  paypalEmail: z.string().email().optional(),
}).refine(data => {
  if (data.paymentMethod === "credit_card") {
    return !!data.cardNumber && !!data.cardName && !!data.expiryDate && !!data.cvv;
  }
  if (data.paymentMethod === "bank_transfer") {
    return !!data.accountNumber && !!data.routingNumber;
  }
  if (data.paymentMethod === "paypal") {
    return !!data.paypalEmail;
  }
  return true;
}, {
  message: "Please fill all required fields for the selected payment method",
  path: ["paymentMethod"],
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceId?: number;
  freelancerId?: number;
  bookingDate?: Date;
  onSuccess?: () => void;
}

export function PaymentForm({
  isOpen,
  onClose,
  amount,
  serviceId,
  freelancerId,
  bookingDate,
  onSuccess,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "credit_card",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
      paypalEmail: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (data: PaymentFormValues) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would integrate with Stripe or another payment processor
      await apiRequest("POST", "/api/payments", {
        paymentMethod: data.paymentMethod,
        amount,
        serviceId,
        freelancerId,
        bookingDate: bookingDate?.toISOString(),
        // Don't include full card details in a real application
        // This is just for demo purposes
        paymentDetails: {
          ...(data.paymentMethod === "credit_card" && {
            lastFourDigits: data.cardNumber?.slice(-4),
            cardName: data.cardName,
          }),
          ...(data.paymentMethod === "bank_transfer" && {
            accountLastFour: data.accountNumber?.slice(-4),
          }),
          ...(data.paymentMethod === "paypal" && {
            email: data.paypalEmail,
          }),
        },
      });

      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred during payment processing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete your payment</DialogTitle>
          <DialogDescription>
            Total amount: ${amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit_card" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit Card
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bank_transfer" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Bank Transfer
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paypal" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <Banknote className="w-4 h-4 mr-2" />
                          PayPal
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          onChange={(e) => {
                            // Format card number with spaces
                            const value = e.target.value.replace(/\s/g, '');
                            const formattedValue = value
                              .replace(/\D/g, '')
                              .slice(0, 16)
                              .replace(/(\d{4})(?=\d)/g, '$1 ');
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              field.onChange(value);
                            }}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {paymentMethod === "paypal" && (
              <FormField
                control={form.control}
                name="paypalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${amount.toFixed(2)}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}