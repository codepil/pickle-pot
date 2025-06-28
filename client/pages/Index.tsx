import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Truck,
  Shield,
  Heart,
  ChefHat,
  Leaf,
  ShoppingCart,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuredProducts = [
    {
      name: "Grandma's Mango Pickle",
      price: "₹249",
      originalPrice: "₹299",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
    },
    {
      name: "Authentic Turmeric Powder",
      price: "₹189",
      originalPrice: "₹229",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 89,
      badge: "Organic",
    },
    {
      name: "Spicy Red Chili Pickle",
      price: "₹199",
      originalPrice: "₹249",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      badge: "Hot",
    },
    {
      name: "Premium Garam Masala",
      price: "₹299",
      originalPrice: "₹349",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 203,
      badge: "Premium",
    },
  ];

  const categories = [
    { name: "Traditional Pickles", icon: "🥒", count: "12+ varieties" },
    { name: "Spice Powders", icon: "🌶️", count: "15+ blends" },
    { name: "Curry Powders", icon: "🍛", count: "8+ authentic" },
    { name: "Seasonal Specials", icon: "🎃", count: "Limited time" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="bg-spice-yellow text-spice-brown text-center py-2 text-sm font-medium">
        FREE DELIVERY ON ORDERS ABOVE ₹500 | USE CODE: PICKLE50
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-spice-cream z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center relative">
                <div className="w-8 h-6 bg-white rounded-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-spice-brown rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-white rounded-b-full border-2 border-spice-brown"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-spice-brown font-display">
                  Pickle Pot
                </h1>
                <p className="text-xs text-spice-muted">
                  Authentic • Traditional • Fresh
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-spice-muted">
                <Truck className="w-4 h-4" />
                <span>Free Delivery</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="border-spice-orange text-spice-orange"
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              <Button className="bg-spice-orange hover:bg-spice-orange/90">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart (0)
              </Button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block pb-4">
            <div className="flex items-center justify-center space-x-8">
              <a
                href="#"
                className="text-spice-brown font-medium border-b-2 border-spice-orange pb-1"
              >
                HOME
              </a>
              <a
                href="#pickles"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                PICKLES
              </a>
              <a
                href="#powders"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                POWDERS
              </a>
              <a
                href="#about"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                OUR STORY
              </a>
              <a
                href="#contact"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                CONTACT
              </a>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-spice-cream py-4">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-spice-brown font-medium">
                  HOME
                </a>
                <a href="#pickles" className="text-spice-muted">
                  PICKLES
                </a>
                <a href="#powders" className="text-spice-muted">
                  POWDERS
                </a>
                <a href="#about" className="text-spice-muted">
                  OUR STORY
                </a>
                <a href="#contact" className="text-spice-muted">
                  CONTACT
                </a>
                <Separator />
                <Button variant="outline" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button className="bg-spice-orange hover:bg-spice-orange/90 justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart (0)
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-spice-yellow text-spice-brown mb-4">
                Handcrafted Since 1985
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-spice-brown mb-6 font-display leading-tight">
                Authentic Flavors,
                <br />
                <span className="text-spice-orange">Traditional Recipes</span>
              </h1>
              <p className="text-lg text-spice-muted mb-8 leading-relaxed">
                Discover our carefully crafted collection of traditional pickles
                and premium spice powders, made with love using age-old family
                recipes and the finest ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-spice-orange hover:bg-spice-orange/90 text-lg px-8"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-spice-orange text-spice-orange text-lg px-8"
                >
                  Our Story
                </Button>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-spice-yellow text-spice-yellow"
                    />
                  ))}
                  <span className="text-spice-muted ml-2">
                    4.8/5 from 1000+ reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-spice-orange to-spice-yellow p-8 shadow-2xl">
                <img
                  src="/placeholder.svg"
                  alt="Fresh spices and pickles"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="text-sm font-medium">Made with Love</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-spice-yellow p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">100% Natural</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-spice-brown mb-4 font-display">
              Explore Our Categories
            </h2>
            <p className="text-spice-muted max-w-2xl mx-auto">
              From tangy pickles to aromatic spice blends, discover the
              authentic flavors that have been passed down through generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-spice-cream hover:border-spice-orange"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-spice-brown mb-2 group-hover:text-spice-orange transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-spice-muted">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-spice-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-spice-brown mb-4 font-display">
              Customer Favorites
            </h2>
            <p className="text-spice-muted max-w-2xl mx-auto">
              These beloved products have earned their place in kitchens across
              the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-spice-cream hover:border-spice-orange"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-spice-yellow text-spice-brown">
                      {product.badge}
                    </Badge>
                    <Button
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-spice-orange hover:bg-spice-cream"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-spice-brown mb-2 group-hover:text-spice-orange transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-spice-yellow text-spice-yellow" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-spice-muted ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-spice-brown">
                          {product.price}
                        </span>
                        <span className="text-sm text-spice-muted line-through ml-2">
                          {product.originalPrice}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-spice-orange hover:bg-spice-orange/90"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-spice-orange text-spice-orange px-8"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-spice-brown mb-4 font-display">
              Why Choose Pickle Pot?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-spice-brown mb-3">
                100% Natural
              </h3>
              <p className="text-spice-muted">
                No artificial preservatives or chemicals. Just pure, natural
                ingredients carefully selected for the best flavor and quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-spice-brown mb-3">
                Traditional Recipes
              </h3>
              <p className="text-spice-muted">
                Authentic family recipes passed down through generations,
                ensuring you get the true taste of traditional Indian flavors.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-spice-brown mb-3">
                Fresh Delivery
              </h3>
              <p className="text-spice-muted">
                Fresh products delivered to your doorstep with care. We ensure
                every order reaches you in perfect condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-spice-brown text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-spice-orange rounded-lg flex items-center justify-center relative">
                  <div className="w-5 h-4 bg-white rounded-full relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-spice-brown rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-white rounded-b-full border border-spice-brown"></div>
                  </div>
                </div>
                <span className="text-xl font-bold font-display">
                  Pickle Pot
                </span>
              </div>
              <p className="text-spice-light mb-4">
                Bringing authentic flavors to your Dinning table since 1985.
                Quality, tradition, and taste in every product.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-spice-orange rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-spice-orange rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-xs">@</span>
                </div>
                <div className="w-8 h-8 bg-spice-orange rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <p className="text-spice-light hover:text-white cursor-pointer">
                  About Us
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Our Products
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Recipes
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Contact
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <div className="space-y-2">
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Shipping Info
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Returns
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  FAQ
                </p>
                <p className="text-spice-light hover:text-white cursor-pointer">
                  Support
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-spice-light">
                <p>📧 hello@spicebazaar.com</p>
                <p>📞 +91 9876543210</p>
                <p>📍 Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>

          <Separator className="bg-spice-orange/30 mb-6" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-spice-light text-sm">
              © 2025 Pickle Pot. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-spice-light hover:text-white cursor-pointer text-sm">
                Privacy Policy
              </span>
              <span className="text-spice-light hover:text-white cursor-pointer text-sm">
                Terms & Conditions
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
