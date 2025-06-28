import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Filter, Search, ShoppingCart, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { AddToCartDialog } from "@/components/AddToCartDialog";

export default function Powders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { state: cartState } = useCart();

  const handleAddToCart = (product: any) => {
    setSelectedProduct({
      ...product,
      category: "powder" as const,
    });
    setDialogOpen(true);
  };

  const powders = [
    {
      id: 201,
      name: "Authentic Turmeric Powder",
      category: "Single Spice",
      price6oz: "$9.99",
      price8oz: "$13.99",
      originalPrice6oz: "$11.99",
      originalPrice8oz: "$15.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 89,
      description: "Pure turmeric powder with high curcumin content",
      type: "Ground Fresh",
      badge: "Organic",
      uses: ["Cooking", "Health", "Beauty"],
      origin: "Maharashtra",
    },
    {
      id: 202,
      name: "Premium Garam Masala",
      category: "Blend",
      price6oz: "$15.99",
      price8oz: "$21.99",
      originalPrice6oz: "$17.99",
      originalPrice8oz: "$23.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 203,
      description: "Royal blend of 12 aromatic spices",
      type: "Freshly Ground",
      badge: "Premium",
      uses: ["Curries", "Rice", "Meat"],
      origin: "Traditional Recipe",
    },
    {
      id: 203,
      name: "Red Chili Powder",
      category: "Single Spice",
      price6oz: "$7.99",
      price8oz: "$11.99",
      originalPrice6oz: "$9.99",
      originalPrice8oz: "$13.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      description: "Fiery red chili powder for authentic heat",
      type: "Sun Dried",
      badge: "Hot",
      uses: ["All Dishes", "Marinades", "Tadka"],
      origin: "Guntur",
    },
    {
      id: 4,
      name: "Coriander Powder",
      category: "Single Spice",
      price6oz: "$6.99",
      price8oz: "$9.99",
      originalPrice6oz: "$8.99",
      originalPrice8oz: "$11.99",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 134,
      description: "Aromatic coriander powder for everyday cooking",
      type: "Fresh Ground",
      badge: "Fresh",
      uses: ["Curries", "Vegetables", "Dal"],
      origin: "Rajasthan",
    },
    {
      id: 5,
      name: "Sambar Powder",
      category: "Regional",
      price6oz: "$11.99",
      price8oz: "$15.99",
      originalPrice6oz: "$13.99",
      originalPrice8oz: "$17.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 98,
      description: "South Indian sambar spice blend",
      type: "Traditional Blend",
      badge: "Authentic",
      uses: ["Sambar", "Rasam", "Vegetables"],
      origin: "Tamil Nadu",
    },
    {
      id: 6,
      name: "Biryani Masala",
      category: "Blend",
      price6oz: "$14.99",
      price8oz: "$19.99",
      originalPrice6oz: "$16.99",
      originalPrice8oz: "$21.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 167,
      description: "Royal biryani spice blend with saffron notes",
      type: "Premium Blend",
      badge: "Royal",
      uses: ["Biryani", "Pulao", "Rice"],
      origin: "Hyderabadi Recipe",
    },
    {
      id: 7,
      name: "Cumin Powder",
      category: "Single Spice",
      price6oz: "$8.99",
      price8oz: "$12.99",
      originalPrice6oz: "$10.99",
      originalPrice8oz: "$14.99",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 76,
      description: "Pure cumin powder with earthy aroma",
      type: "Roasted & Ground",
      badge: "Pure",
      uses: ["Tadka", "Vegetables", "Raita"],
      origin: "Gujarat",
    },
    {
      id: 8,
      name: "Kitchen King Masala",
      category: "Blend",
      price6oz: "$12.99",
      price8oz: "$17.99",
      originalPrice6oz: "$14.99",
      originalPrice8oz: "$19.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 143,
      description: "All-purpose spice blend for daily cooking",
      type: "Multi-Purpose",
      badge: "Versatile",
      uses: ["All Vegetables", "Dal", "Curries"],
      origin: "North Indian Recipe",
    },
    {
      id: 9,
      name: "Black Pepper Powder",
      category: "Single Spice",
      price6oz: "$19.99",
      price8oz: "$26.99",
      originalPrice6oz: "$22.99",
      originalPrice8oz: "$29.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 92,
      description: "Premium black pepper powder with intense flavor",
      type: "Coarse Ground",
      badge: "Premium",
      uses: ["Seasoning", "Health", "Soups"],
      origin: "Kerala",
    },
    {
      id: 10,
      name: "Tandoori Masala",
      category: "Blend",
      price6oz: "$13.99",
      price8oz: "$18.99",
      originalPrice6oz: "$15.99",
      originalPrice8oz: "$20.99",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 118,
      description: "Smoky tandoori spice blend with paprika",
      type: "BBQ Blend",
      badge: "Smoky",
      uses: ["Tandoori", "Grilling", "Marinades"],
      origin: "Punjabi Recipe",
    },
  ];

  const categories = ["All", "Single Spice", "Blend", "Regional"];

  const filteredPowders = powders.filter((powder) => {
    const matchesSearch =
      powder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      powder.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || powder.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Organic":
        return "bg-green-100 text-green-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Hot":
        return "bg-red-100 text-red-800";
      case "Fresh":
        return "bg-blue-100 text-blue-800";
      case "Authentic":
        return "bg-orange-100 text-orange-800";
      case "Royal":
        return "bg-yellow-100 text-yellow-800";
      case "Pure":
        return "bg-gray-100 text-gray-800";
      case "Versatile":
        return "bg-indigo-100 text-indigo-800";
      case "Smoky":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-spice-yellow text-spice-brown";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
              Premium Spice Powders
            </h1>
            <p className="text-lg text-spice-muted max-w-2xl mx-auto">
              Explore our carefully curated collection of aromatic spice
              powders, freshly ground to preserve authentic flavors. Available
              in 6oz and 8oz glass bottles.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-spice-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                <Input
                  placeholder="Search spice powders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-spice-cream focus:border-spice-orange"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-spice-orange hover:bg-spice-orange/90 whitespace-nowrap"
                      : "border-spice-cream text-spice-muted hover:border-spice-orange whitespace-nowrap"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-spice-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-spice-muted">
              Showing {filteredPowders.length} of {powders.length} spice powders
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-spice-cream text-spice-muted"
            >
              <Filter className="w-4 h-4 mr-2" />
              Sort by Price
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPowders.map((powder) => (
              <Card
                key={powder.id}
                className="group hover:shadow-xl transition-all duration-300 border-spice-cream hover:border-spice-orange"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={powder.image}
                      alt={powder.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${getBadgeColor(powder.badge)}`}
                    >
                      {powder.badge}
                    </Badge>
                    <Button
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-spice-orange hover:bg-spice-cream"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Badge className="absolute bottom-3 left-3 bg-white text-spice-brown">
                      {powder.type}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-spice-cream text-spice-muted"
                      >
                        6oz & 8oz
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-spice-cream text-spice-muted"
                      >
                        {powder.category}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-spice-brown mb-2 group-hover:text-spice-orange transition-colors">
                      {powder.name}
                    </h3>

                    <p className="text-sm text-spice-muted mb-3 line-clamp-2">
                      {powder.description}
                    </p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(powder.rating) ? "fill-spice-yellow text-spice-yellow" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-spice-muted ml-2">
                        ({powder.reviews})
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-spice-muted mb-1">
                        Origin: {powder.origin}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {powder.uses
                          .slice(0, 2)
                          .map((use: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-spice-cream text-spice-brown"
                            >
                              {use}
                            </Badge>
                          ))}
                        {powder.uses.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-spice-cream text-spice-brown"
                          >
                            +{powder.uses.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-spice-brown">
                          {powder.price6oz}
                        </span>
                        <span className="text-sm text-spice-muted line-through ml-2">
                          {powder.originalPrice6oz}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-spice-orange hover:bg-spice-orange/90"
                        onClick={() => handleAddToCart(powder)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPowders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌶️</div>
              <h3 className="text-xl font-semibold text-spice-brown mb-2">
                No spice powders found
              </h3>
              <p className="text-spice-muted">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-spice-brown mb-4 font-display">
            Get Fresh Spice Updates
          </h2>
          <p className="text-spice-muted mb-6">
            Subscribe to receive updates about new spice blends and grinding
            schedules
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-1 border-spice-cream focus:border-spice-orange"
            />
            <Button className="bg-spice-orange hover:bg-spice-orange/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
}
