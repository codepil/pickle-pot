import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/Header";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Calendar,
  CreditCard,
  Truck,
  Shield,
  Gift,
  Percent,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { state, dispatch } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("credit-card");

  const promoCodes = {
    PICKLE50: { discount: 5.0, description: "Save $5 on your order" },
    WELCOME10: {
      discount: 0.1,
      description: "10% off first order",
      isPercentage: true,
    },
    FREESHIP: { discount: 5.0, description: "Free shipping" },
  };

  const applyPromoCode = () => {
    const upperPromo = promoCode.toUpperCase();
    if (promoCodes[upperPromo as keyof typeof promoCodes]) {
      setAppliedPromo(upperPromo);
      setPromoCode("");
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const promo = promoCodes[appliedPromo as keyof typeof promoCodes];
    if (promo.isPercentage) {
      return state.total * promo.discount;
    }
    return promo.discount;
  };

  const discount = calculateDiscount();
  const shipping = state.total >= 25 || appliedPromo === "FREESHIP" ? 0 : 5.99;
  const tax = (state.total - discount) * 0.08; // 8% tax
  const finalTotal = state.total - discount + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton backButtonText="Continue Shopping" />

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-spice-brown mb-4 font-display">
            Your Cart is Empty
          </h2>
          <p className="text-lg text-spice-muted mb-8">
            Looks like you haven't added any delicious pickles or spices yet!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-spice-orange hover:bg-spice-orange/90"
              size="lg"
              onClick={() => (window.location.href = "/pickles")}
            >
              Shop Pickles
            </Button>
            <Button
              variant="outline"
              className="border-spice-orange text-spice-orange"
              size="lg"
              onClick={() => (window.location.href = "/powders")}
            >
              Shop Spice Powders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spice-light">
      <Header showBackButton backButtonText="Continue Shopping" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-spice-brown mb-2 font-display">
            Shopping Cart
          </h1>
          <p className="text-spice-muted">
            {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="border-spice-cream">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-spice-cream"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-spice-brown text-lg">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-spice-yellow text-spice-brown text-xs">
                              {item.badge}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs border-spice-cream"
                            >
                              {item.size}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-spice-muted">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Deliver by:{" "}
                              {new Date(item.deliveryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="border-spice-cream hover:border-spice-orange"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="border-spice-cream hover:border-spice-orange"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-spice-brown">
                            $
                            {(
                              parseFloat(item.price.replace("$", "")) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                          <div className="text-sm text-spice-muted line-through">
                            $
                            {(
                              parseFloat(item.originalPrice.replace("$", "")) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card className="border-spice-cream">
              <CardHeader>
                <CardTitle className="text-spice-brown flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!appliedPromo ? (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-spice-cream focus:border-spice-orange"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      className="border-spice-orange text-spice-orange"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 font-medium">
                        {appliedPromo}
                      </span>
                    </div>
                    <Button
                      onClick={removePromoCode}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="text-xs text-spice-muted">
                  Try: PICKLE50, WELCOME10, or FREESHIP
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-spice-cream">
              <CardHeader>
                <CardTitle className="text-spice-brown">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-spice-muted">Subtotal</span>
                  <span className="font-medium">${state.total.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-spice-muted flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Shipping
                  </span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-spice-muted">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold text-spice-brown">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                {state.total < 25 && appliedPromo !== "FREESHIP" && (
                  <div className="text-sm text-spice-muted bg-spice-light p-3 rounded-lg">
                    Add ${(25 - state.total).toFixed(2)} more for free shipping!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-spice-cream">
              <CardHeader>
                <CardTitle className="text-spice-brown flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">
                      Credit/Debit Card
                    </SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple-pay">Apple Pay</SelectItem>
                    <SelectItem value="google-pay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-spice-brown">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-spice-brown">Expiry</Label>
                    <Input
                      placeholder="MM/YY"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-spice-brown">CVV</Label>
                    <Input
                      placeholder="123"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-spice-brown">ZIP Code</Label>
                    <Input
                      placeholder="12345"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 text-sm text-spice-muted bg-white p-3 rounded-lg border border-spice-cream">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-spice-orange hover:bg-spice-orange/90 h-12 text-lg"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Complete Order - ${finalTotal.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
