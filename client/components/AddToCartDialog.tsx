import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Clock, Plus, Minus } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price6oz?: string;
  price8oz?: string;
  originalPrice6oz?: string;
  originalPrice8oz?: string;
  image: string;
  badge: string;
  category: "pickle" | "powder";
}

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
}: AddToCartDialogProps) {
  const [selectedSize, setSelectedSize] = useState("6oz");
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const { dispatch } = useCart();

  if (!product) return null;

  const getCurrentPrice = () => {
    if (selectedSize === "6oz") {
      return product.price6oz || "$0.00";
    }
    return product.price8oz || "$0.00";
  };

  const getOriginalPrice = () => {
    if (selectedSize === "6oz") {
      return product.originalPrice6oz || "$0.00";
    }
    return product.originalPrice8oz || "$0.00";
  };

  const getMinDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2); // Minimum 2 days from today
    return today.toISOString().split("T")[0];
  };

  const getMaxDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // Maximum 30 days from today
    return today.toISOString().split("T")[0];
  };

  const handleAddToCart = () => {
    if (!deliveryDate) {
      alert("Please select a delivery date");
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      price: getCurrentPrice(),
      originalPrice: getOriginalPrice(),
      image: product.image,
      size: selectedSize,
      quantity,
      deliveryDate,
      category: product.category,
      badge: product.badge,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
    onOpenChange(false);

    // Reset form
    setQuantity(1);
    setDeliveryDate("");
    setSelectedSize("6oz");
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-spice-brown font-display">
            Add to Cart
          </DialogTitle>
          <DialogDescription>
            Configure your order details before adding to cart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-start space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border border-spice-cream"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-spice-brown">{product.name}</h3>
              <Badge className="bg-spice-yellow text-spice-brown text-xs mt-1">
                {product.badge}
              </Badge>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label className="text-spice-brown font-medium">
              <Package className="w-4 h-4 inline mr-2" />
              Size
            </Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6oz">6oz Bottle</SelectItem>
                <SelectItem value="8oz">8oz Bottle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Display */}
          <div className="flex items-center justify-between p-3 bg-spice-light rounded-lg">
            <span className="text-spice-muted">Price:</span>
            <div>
              <span className="text-lg font-bold text-spice-brown">
                {getCurrentPrice()}
              </span>
              <span className="text-sm text-spice-muted line-through ml-2">
                {getOriginalPrice()}
              </span>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label className="text-spice-brown font-medium">Quantity</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="border-spice-cream hover:border-spice-orange"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 10) setQuantity(val);
                }}
                className="w-20 text-center border-spice-cream focus:border-spice-orange"
                min="1"
                max="10"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= 10}
                className="border-spice-cream hover:border-spice-orange"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="space-y-2">
            <Label className="text-spice-brown font-medium">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Delivery Date
            </Label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={getMinDeliveryDate()}
              max={getMaxDeliveryDate()}
              className="border-spice-cream focus:border-spice-orange"
            />
            <p className="text-xs text-spice-muted flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Delivery available 2-30 days from today
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3 bg-spice-cream rounded-lg">
            <span className="font-medium text-spice-brown">Total:</span>
            <span className="text-xl font-bold text-spice-brown">
              $
              {(
                parseFloat(getCurrentPrice().replace("$", "")) * quantity
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-spice-cream text-spice-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="bg-spice-orange hover:bg-spice-orange/90"
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
