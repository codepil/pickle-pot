import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Heart, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    name: string;
    price6oz: string;
    price8oz: string;
    originalPrice6oz?: string;
    originalPrice8oz?: string;
    image: string;
    rating: number;
    reviews: number;
    badge?: string;
    category: "pickle" | "powder";
    description?: string;
    ingredients?: string[];
    nutritionFacts?: {
      calories: string;
      fat: string;
      sodium: string;
      carbs: string;
      protein: string;
    };
  } | null;
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState("6oz");
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState("medium");
  const { dispatch: cartDispatch } = useCart();

  if (!product) return null;

  const currentPrice =
    selectedSize === "6oz" ? product.price6oz : product.price8oz;
  const originalPrice =
    selectedSize === "6oz"
      ? product.originalPrice6oz
      : product.originalPrice8oz;

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedSize}-${spiceLevel}`,
      productId: product.id,
      name: product.name,
      price: parseFloat(currentPrice.replace("$", "")),
      quantity,
      size: selectedSize,
      spiceLevel: product.category === "pickle" ? spiceLevel : undefined,
      image: product.image,
      category: product.category,
    };

    cartDispatch({ type: "ADD_ITEM", payload: cartItem });
    onOpenChange(false);

    // Reset form
    setQuantity(1);
    setSelectedSize("6oz");
    setSpiceLevel("medium");
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-spice-brown font-display">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-spice-yellow text-spice-brown">
                  {product.badge}
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-spice-yellow text-spice-yellow"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-spice-muted">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-spice-brown">Description</h3>
                <p className="text-spice-muted text-sm leading-relaxed">
                  {product.description ||
                    `Experience the authentic taste of ${product.name.toLowerCase()}. Made with traditional recipes and the finest ingredients, this ${product.category} brings the genuine flavors of Indian cuisine to your table. Perfect for enhancing your meals with authentic taste and aroma.`}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-spice-brown">Ingredients</h3>
                <p className="text-spice-muted text-sm">
                  {product.ingredients?.join(", ") ||
                    (product.category === "pickle"
                      ? "Fresh vegetables, spices, oil, salt, traditional herbs and seasonings"
                      : "Premium spices, natural herbs, traditional grinding methods")}
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Options */}
          <div className="space-y-6">
            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-spice-brown">
                  {currentPrice}
                </span>
                {originalPrice && (
                  <span className="text-lg text-spice-muted line-through">
                    {originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium">
                Free delivery on orders above $25
              </p>
            </div>

            <Separator />

            {/* Size Selection */}
            <div className="space-y-3">
              <Label className="text-spice-brown font-medium">Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6oz">6oz - {product.price6oz}</SelectItem>
                  <SelectItem value="8oz">8oz - {product.price8oz}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spice Level for Pickles */}
            {product.category === "pickle" && (
              <div className="space-y-3">
                <Label className="text-spice-brown font-medium">
                  Spice Level
                </Label>
                <Select value={spiceLevel} onValueChange={setSpiceLevel}>
                  <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild 🌶️</SelectItem>
                    <SelectItem value="medium">Medium 🌶️🌶️</SelectItem>
                    <SelectItem value="hot">Hot 🌶️🌶️🌶️</SelectItem>
                    <SelectItem value="extra-hot">
                      Extra Hot 🌶️🌶️🌶️🌶️
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-spice-brown font-medium">Quantity</Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="border-spice-cream"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center border-spice-cream focus:border-spice-orange"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                  className="border-spice-cream"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Total Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-spice-brown">Total:</span>
                <span className="font-bold text-spice-brown">
                  $
                  {(
                    parseFloat(currentPrice.replace("$", "")) * quantity
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-spice-orange hover:bg-spice-orange/90 text-lg py-6"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Nutrition Facts */}
            {product.nutritionFacts && (
              <div className="space-y-3 pt-4 border-t border-spice-cream">
                <h3 className="font-semibold text-spice-brown">
                  Nutrition Facts (per serving)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-spice-muted">Calories:</span>
                    <span className="text-spice-brown">
                      {product.nutritionFacts.calories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-spice-muted">Fat:</span>
                    <span className="text-spice-brown">
                      {product.nutritionFacts.fat}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-spice-muted">Sodium:</span>
                    <span className="text-spice-brown">
                      {product.nutritionFacts.sodium}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-spice-muted">Carbs:</span>
                    <span className="text-spice-brown">
                      {product.nutritionFacts.carbs}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
