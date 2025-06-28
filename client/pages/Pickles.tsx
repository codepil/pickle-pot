import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Filter,
  Search,
  ShoppingCart,
  Heart,
  ChefHat,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Pickles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const pickles = [
    {
      id: 1,
      name: "Grandma's Mango Pickle",
      category: "Mango",
      price6oz: "$12.99",
      price8oz: "$16.99",
      originalPrice6oz: "$14.99",
      originalPrice8oz: "$18.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      description:
        "Traditional raw mango pickle with mustard oil and authentic spices",
      spiceLevel: "Medium",
      badge: "Best Seller",
      ingredients: [
        "Raw Mango",
        "Mustard Oil",
        "Red Chili",
        "Turmeric",
        "Fenugreek",
      ],
    },
    {
      id: 2,
      name: "Spicy Red Chili Pickle",
      category: "Chili",
      price6oz: "$10.99",
      price8oz: "$14.99",
      originalPrice6oz: "$12.99",
      originalPrice8oz: "$16.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      description: "Fiery red chili pickle for spice lovers",
      spiceLevel: "Hot",
      badge: "Hot",
      ingredients: ["Red Chili", "Sesame Oil", "Garlic", "Salt", "Hing"],
    },
    {
      id: 3,
      name: "Sweet Lime Pickle",
      category: "Citrus",
      price6oz: "$9.99",
      price8oz: "$13.99",
      originalPrice6oz: "$11.99",
      originalPrice8oz: "$15.99",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 89,
      description: "Tangy and sweet lime pickle with jaggery",
      spiceLevel: "Mild",
      badge: "Sweet",
      ingredients: ["Sweet Lime", "Jaggery", "Ginger", "Green Chili", "Salt"],
    },
    {
      id: 4,
      name: "Mixed Vegetable Pickle",
      category: "Mixed",
      price6oz: "$14.99",
      price8oz: "$18.99",
      originalPrice6oz: "$16.99",
      originalPrice8oz: "$20.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 203,
      description: "Assorted vegetables in traditional pickle masala",
      spiceLevel: "Medium",
      badge: "Premium",
      ingredients: ["Carrot", "Cauliflower", "Turnip", "Green Chili", "Spices"],
    },
    {
      id: 5,
      name: "Lemon Pickle",
      category: "Citrus",
      price6oz: "$8.99",
      price8oz: "$12.99",
      originalPrice6oz: "$10.99",
      originalPrice8oz: "$14.99",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 95,
      description: "Classic lemon pickle with traditional spices",
      spiceLevel: "Medium",
      badge: "Classic",
      ingredients: ["Lemon", "Salt", "Turmeric", "Red Chili", "Mustard Seeds"],
    },
    {
      id: 6,
      name: "Garlic Pickle",
      category: "Garlic",
      price6oz: "$11.99",
      price8oz: "$15.99",
      originalPrice6oz: "$13.99",
      originalPrice8oz: "$17.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 78,
      description: "Pungent garlic pickle with mustard oil",
      spiceLevel: "Hot",
      badge: "Pungent",
      ingredients: ["Garlic", "Mustard Oil", "Red Chili", "Salt", "Hing"],
    },
    {
      id: 7,
      name: "Ginger Pickle",
      category: "Ginger",
      price6oz: "$10.99",
      price8oz: "$14.99",
      originalPrice6oz: "$12.99",
      originalPrice8oz: "$16.99",
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 112,
      description: "Fresh ginger pickle with aromatic spices",
      spiceLevel: "Medium",
      badge: "Fresh",
      ingredients: ["Fresh Ginger", "Lemon Juice", "Salt", "Turmeric", "Oil"],
    },
    {
      id: 8,
      name: "Turnip Pickle",
      category: "Vegetable",
      price6oz: "$8.99",
      price8oz: "$11.99",
      originalPrice6oz: "$9.99",
      originalPrice8oz: "$13.99",
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 67,
      description: "Crunchy turnip pickle with mustard seeds",
      spiceLevel: "Mild",
      badge: "Crunchy",
      ingredients: ["Turnip", "Mustard Seeds", "Salt", "Oil", "Spices"],
    },
  ];

  const categories = [
    "All",
    "Mango",
    "Chili",
    "Citrus",
    "Mixed",
    "Garlic",
    "Ginger",
    "Vegetable",
  ];

  const filteredPickles = pickles.filter((pickle) => {
    const matchesSearch =
      pickle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || pickle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case "Mild":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hot":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-spice-cream z-50">
        <div className="max-w-7xl mx-auto px-4">
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
            <Button
              variant="outline"
              className="border-spice-orange text-spice-orange"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
              Traditional Pickles
            </h1>
            <p className="text-lg text-spice-muted max-w-2xl mx-auto">
              Discover our authentic collection of handcrafted pickles, made
              with love using traditional family recipes. Available in
              convenient 6oz and 8oz glass bottles.
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
                  placeholder="Search pickles..."
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
              Showing {filteredPickles.length} of {pickles.length} pickles
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
            {filteredPickles.map((pickle) => (
              <PickleCard key={pickle.id} pickle={pickle} />
            ))}
          </div>

          {filteredPickles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥒</div>
              <h3 className="text-xl font-semibold text-spice-brown mb-2">
                No pickles found
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
            Stay Updated with New Pickle Varieties
          </h2>
          <p className="text-spice-muted mb-6">
            Be the first to know about our seasonal specials and new pickle
            launches
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
    </div>
  );
}

function PickleCard({ pickle }: { pickle: any }) {
  const [selectedSize, setSelectedSize] = useState("6oz");

  const getCurrentPrice = () => {
    return selectedSize === "6oz" ? pickle.price6oz : pickle.price8oz;
  };

  const getOriginalPrice = () => {
    return selectedSize === "6oz"
      ? pickle.originalPrice6oz
      : pickle.originalPrice8oz;
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case "Mild":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hot":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-spice-cream hover:border-spice-orange">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={pickle.image}
            alt={pickle.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-spice-yellow text-spice-brown">
            {pickle.badge}
          </Badge>
          <Button
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-spice-orange hover:bg-spice-cream"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Badge
            className={`absolute bottom-3 left-3 ${getSpiceLevelColor(pickle.spiceLevel)}`}
          >
            {pickle.spiceLevel}
          </Badge>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-20 h-8 text-xs border-spice-cream">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6oz">6oz</SelectItem>
                <SelectItem value="8oz">8oz</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className="text-xs border-spice-cream text-spice-muted"
            >
              {pickle.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-spice-brown mb-2 group-hover:text-spice-orange transition-colors">
            {pickle.name}
          </h3>

          <p className="text-sm text-spice-muted mb-3 line-clamp-2">
            {pickle.description}
          </p>

          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(pickle.rating) ? "fill-spice-yellow text-spice-yellow" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-spice-muted ml-2">
              ({pickle.reviews})
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {pickle.ingredients
              .slice(0, 3)
              .map((ingredient: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs bg-spice-cream text-spice-brown"
                >
                  {ingredient}
                </Badge>
              ))}
            {pickle.ingredients.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-spice-cream text-spice-brown"
              >
                +{pickle.ingredients.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-spice-brown">
                {getCurrentPrice()}
              </span>
              <span className="text-sm text-spice-muted line-through ml-2">
                {getOriginalPrice()}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-spice-orange hover:bg-spice-orange/90"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
