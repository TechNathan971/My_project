import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  Truck, 
  ArrowLeft,
  Package,
  CheckCircle
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || cartItems.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create order after successful payment
        try {
          const orderResponse = await apiRequest("POST", "/api/orders", {
            total: finalTotal,
            stripePaymentIntentId: "pi_placeholder", // This would be from the payment intent
          });

          await clearCart();
          
          toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly.",
          });

          setLocation("/order-success");
        } catch (orderError) {
          console.error("Order creation failed:", orderError);
          toast({
            title: "Payment Successful",
            description: "Your payment was processed, but there was an issue creating your order. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || !elements || isProcessing || cartItems.length === 0}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Complete Order - ${finalTotal.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, isLoading } = useCart();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice + shippingCost;

  // Redirect if not authenticated
  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Redirect if cart is empty
  if (!isLoading && cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  useEffect(() => {
    if (cartItems.length > 0 && totalPrice > 0 && stripePromise) {
      // Create PaymentIntent as soon as the page loads
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: finalTotal 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Failed to create payment intent:", error);
          // If Stripe is not configured, set a dummy client secret to show the demo
          setClientSecret("demo_mode");
        });
    } else if (cartItems.length > 0 && totalPrice > 0) {
      // Demo mode without Stripe
      setClientSecret("demo_mode");
    }
  }, [finalTotal, cartItems.length, totalPrice, stripePromise]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Preparing payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/cart")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Cart</span>
          </div>
          <div className="w-8 h-px bg-primary" />
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm font-medium text-primary">Checkout</span>
          </div>
          <div className="w-8 h-px bg-muted" />
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs">
              3
            </div>
            <span className="text-sm text-muted-foreground">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {stripePromise && clientSecret !== "demo_mode" ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Demo Checkout</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        <strong>Demo Mode:</strong> Stripe payment processing is not configured. 
                        In a real store, customers would enter their payment details here.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Card Number</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        •••• •••• •••• ••••
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Expiry</label>
                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                          MM/YY
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">CVC</label>
                        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                          •••
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={async () => {
                      try {
                        await apiRequest("POST", "/api/orders", {
                          total: finalTotal,
                          stripePaymentIntentId: "demo_payment",
                        });
                        await clearCart();
                        toast({
                          title: "Demo Order Placed!",
                          description: "This is a demo. In production, real payment would be processed.",
                        });
                        setLocation("/");
                      } catch (error) {
                        toast({
                          title: "Demo Order Created",
                          description: "Order simulation complete. This is demo mode.",
                        });
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Place Demo Order - ${finalTotal.toFixed(2)}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Cart Items Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 bg-cover bg-center rounded-lg"
                          style={{ 
                            backgroundImage: item.product.imageUrl 
                              ? `url(${item.product.imageUrl})` 
                              : "url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100)"
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {totalPrice < 100 && (
                      <div className="text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                        </Badge>
                      </div>
                    )}

                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Guarantees */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="text-sm font-medium">Secure Payment</h4>
                      <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium">Fast Delivery</h4>
                      <p className="text-xs text-muted-foreground">2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="text-sm font-medium">Easy Returns</h4>
                      <p className="text-xs text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accepted Payment Methods */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3">Accepted Payment Methods</h4>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <svg className="w-8 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.46c2.204 0 3.894.493 4.701 1.359.779.835 1.035 2.045.767 3.618-.201 1.183-.597 2.091-1.17 2.73-.622.693-1.503 1.185-2.6 1.508 1.678.357 2.763 1.034 3.148 2.075.385 1.042.168 2.405-.558 3.917-.726 1.513-1.816 2.612-3.269 3.298-1.453.686-3.109 1.031-4.922 1.031H7.076zM14.146 7.26c.68 0 1.235-.155 1.664-.466.43-.311.707-.774.831-1.39.124-.616.02-1.067-.312-1.355-.332-.288-.83-.432-1.492-.432H11.51L10.8 7.26h3.346zm-1.664 6.695c.68 0 1.267-.212 1.761-.635.494-.423.834-.974 1.02-1.653.186-.679.067-1.173-.357-1.481-.424-.308-.998-.462-1.721-.462H9.839l-.786 4.231h3.429z"/>
                    </svg>
                    <svg className="w-8 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.539 9.186a4.155 4.155 0 0 0-1.451-.251c-1.6 0-2.73.806-2.738 1.963-.01.85.803 1.329 1.418 1.613.631.292.842.479.84.740-.004.397-.504.577-.969.577-.65 0-.998-.094-1.533-.327l-.211-.098-.229 1.416c.389.179 1.11.332 1.857.34 1.704 0 2.813-.842 2.822-2.146.014-.679-.426-1.192-1.359-1.616-.566-.275-.912-.459-.912-.738 0-.247.299-.511.943-.511a2.95 2.95 0 0 1 1.226.24l.148.07.227-1.416-.204-.08z"/>
                      <path d="M18.108 5.014H16.42c-.53 0-.924.154-1.156.716l-3.284 7.927h1.704s.279-.756.342-.919h2.108c.049.219.199.919.199.919h1.506l-1.131-8.643zm-1.956 5.629c.138-.359.677-1.764.677-1.764s.128-.342.207-.564l.105.513s.298 1.379.359 1.679h-1.348v.136z"/>
                    </svg>
                    <svg className="w-8 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.045 7.514c-.41-.78-1.551-.78-1.96 0l-.887 1.69a.5.5 0 01-.374.274l-1.908.279c-.88.128-1.232 1.212-.596 1.833l1.38 1.345a.5.5 0 01.144.442l-.326 1.9c-.15.876.77 1.546 1.553 1.132l1.706-.897a.5.5 0 01.465 0l1.706.897c.783.414 1.703-.256 1.553-1.132l-.326-1.9a.5.5 0 01.144-.442l1.38-1.345c.636-.621.284-1.705-.596-1.833l-1.908-.279a.5.5 0 01-.374-.274l-.887-1.69z"/>
                    </svg>
                    <span className="text-xs">and more...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
