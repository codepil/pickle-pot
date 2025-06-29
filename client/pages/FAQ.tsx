import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Package,
  Truck,
  CreditCard,
  Shield,
  Clock,
  Mail,
  Phone,
  Utensils,
  AlertTriangle,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: "shipping-delivery",
      question: "What are your shipping and delivery options?",
      answer:
        "We offer free shipping on orders over $25 within the United States. Standard delivery takes 3-5 business days, and we also offer expedited 2-day shipping for an additional fee. Orders are processed within 1-2 business days. We ship Monday through Friday and provide tracking information via email once your order ships.",
      category: "Shipping",
      tags: ["shipping", "delivery", "free shipping", "tracking"],
    },
    {
      id: "product-sizes",
      question: "What sizes do your products come in?",
      answer:
        "All our pickles and spice powders are available in two convenient sizes: 6oz glass bottles ($8.99-$19.99) and 8oz glass bottles ($11.99-$26.99). The glass bottles are perfect for preserving freshness and can be reused after finishing the product.",
      category: "Products",
      tags: ["sizes", "bottles", "6oz", "8oz", "glass"],
    },
    {
      id: "ingredient-info",
      question: "Can I see the full ingredient list for your products?",
      answer:
        "Absolutely! We believe in complete transparency. Each product page lists all ingredients, and our labels include detailed ingredient information. Most of our pickles contain vegetables, mustard oil, spices, and salt. Our spice powders are made from pure, ground spices with no artificial additives or preservatives.",
      category: "Products",
      tags: ["ingredients", "transparency", "natural", "preservatives"],
    },
    {
      id: "allergen-safety",
      question: "Do your products contain common allergens?",
      answer:
        "Some of our products may contain or be processed in facilities that handle nuts, sesame, mustard, and other common allergens. We clearly label all allergen information on our product pages and packaging. If you have specific allergies, please check the ingredient list carefully or contact us for detailed allergen information.",
      category: "Safety",
      tags: ["allergens", "nuts", "sesame", "mustard", "safety"],
    },
    {
      id: "shelf-life",
      question: "How long do your products stay fresh?",
      answer:
        "Our pickles have a shelf life of 12-18 months when stored properly in a cool, dry place. Once opened, refrigerate and consume within 3-6 months. Spice powders maintain peak flavor for 2-3 years when stored in airtight containers away from heat and light. All products include expiration dates on the packaging.",
      category: "Storage",
      tags: ["shelf life", "storage", "expiration", "freshness"],
    },
    {
      id: "spice-levels",
      question: "How spicy are your pickles? Can I see spice levels?",
      answer:
        "We rate our pickles on a 3-level spice scale: Mild (green), Medium (yellow), and Hot (red). Each product page shows the spice level clearly. Our mild pickles are perfect for sensitive palates, medium offers traditional Indian heat levels, and hot pickles are for serious spice lovers. Ingredient lists also indicate the types of chilies used.",
      category: "Products",
      tags: ["spice level", "mild", "medium", "hot", "chilies"],
    },
    {
      id: "payment-methods",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted, PCI-compliant systems. Your payment information is never stored on our servers.",
      category: "Payment",
      tags: ["payment", "credit cards", "paypal", "apple pay", "secure"],
    },
    {
      id: "return-policy",
      question: "What is your return and refund policy?",
      answer:
        "We want you to be completely satisfied! If you're not happy with your order, contact us within 30 days of delivery. Unopened products in original packaging can be returned for a full refund. Due to food safety regulations, opened perishable items cannot be returned unless there's a quality issue. Return shipping costs are covered by us if the return is due to our error.",
      category: "Returns",
      tags: ["returns", "refunds", "30 days", "unopened", "quality"],
    },
    {
      id: "organic-natural",
      question: "Are your products organic and natural?",
      answer:
        "Many of our products are made with organic ingredients, clearly marked with 'Organic' badges. All our products are made with natural ingredients - no artificial colors, flavors, or preservatives. We source spices from trusted farmers and use traditional preparation methods that have been passed down through generations.",
      category: "Products",
      tags: ["organic", "natural", "traditional", "no preservatives"],
    },
    {
      id: "bulk-orders",
      question: "Do you offer bulk or wholesale pricing?",
      answer:
        "Yes! We offer special pricing for bulk orders (12+ units) and wholesale accounts for restaurants, grocery stores, and food service businesses. Contact us at hello@thepicklepot.com with your requirements, and we'll provide a custom quote within 24 hours.",
      category: "Business",
      tags: ["bulk", "wholesale", "restaurants", "business", "custom quote"],
    },
    {
      id: "gift-options",
      question: "Can I send your products as gifts?",
      answer:
        "Absolutely! We offer gift wrapping services and can include personalized messages. You can ship directly to the recipient with a gift receipt. We also offer curated gift sets featuring our most popular pickles and spices - perfect for food lovers and anyone interested in authentic Indian flavors.",
      category: "Gifts",
      tags: ["gifts", "gift wrapping", "gift sets", "personalized"],
    },
    {
      id: "storage-tips",
      question: "How should I store your products after opening?",
      answer:
        "For pickles: Refrigerate after opening and always use a clean, dry spoon to prevent contamination. The oil layer on top helps preserve freshness. For spice powders: Store in airtight containers in a cool, dry place away from direct sunlight. Avoid storing near the stove or in humid areas. Proper storage maintains flavor and extends shelf life.",
      category: "Storage",
      tags: ["storage", "refrigerate", "airtight", "clean spoon", "oil layer"],
    },
    {
      id: "recipe-suggestions",
      question: "Do you provide recipe suggestions for your products?",
      answer:
        "Yes! Each product page includes suggested uses, and we regularly share recipes on our social media. You can also sign up for our newsletter to receive monthly recipe ideas, cooking tips, and ways to incorporate our pickles and spices into various cuisines - not just Indian dishes!",
      category: "Recipes",
      tags: [
        "recipes",
        "cooking tips",
        "newsletter",
        "social media",
        "cuisines",
      ],
    },
    {
      id: "international-shipping",
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within the United States due to food import regulations and to ensure product quality during transit. We're working on expanding to Canada and hope to offer international shipping in the future. Follow us on social media for updates on shipping expansion.",
      category: "Shipping",
      tags: ["international", "US only", "Canada", "import regulations"],
    },
    {
      id: "custom-spice-blends",
      question: "Can you create custom spice blends?",
      answer:
        "Yes! We love creating custom blends for special occasions, dietary requirements, or specific flavor preferences. Contact us with your requirements - whether it's a milder version of our garam masala or a unique blend for your restaurant. Custom orders typically require a minimum quantity and 7-10 business days processing time.",
      category: "Custom",
      tags: [
        "custom blends",
        "special occasions",
        "dietary",
        "minimum quantity",
      ],
    },
    {
      id: "contact-support",
      question: "How can I contact customer support?",
      answer:
        "We're here to help! Email us at hello@thepicklepot.com for non-urgent inquiries (we respond within 24 hours). For immediate assistance, call us at +1 408 219 1573 during business hours (Monday-Friday, 9 AM - 6 PM PST). You can also reach out through our contact form on the website.",
      category: "Support",
      tags: [
        "customer support",
        "email",
        "phone",
        "business hours",
        "contact form",
      ],
    },
  ];

  const categories = [
    "All",
    "Products",
    "Shipping",
    "Payment",
    "Returns",
    "Storage",
    "Safety",
    "Recipes",
    "Business",
    "Gifts",
    "Custom",
    "Support",
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Products":
        return <Package className="w-4 h-4" />;
      case "Shipping":
        return <Truck className="w-4 h-4" />;
      case "Payment":
        return <CreditCard className="w-4 h-4" />;
      case "Safety":
        return <Shield className="w-4 h-4" />;
      case "Storage":
        return <Clock className="w-4 h-4" />;
      case "Recipes":
        return <Utensils className="w-4 h-4" />;
      case "Support":
        return <Mail className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-spice-muted max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping,
            storage, and more. Can't find what you're looking for? Contact our
            support team!
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-spice-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-spice-cream focus:border-spice-orange"
              />
            </div>

            <div className="flex flex-wrap gap-2">
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
                      ? "bg-spice-orange hover:bg-spice-orange/90"
                      : "border-spice-cream text-spice-muted hover:border-spice-orange"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center text-spice-muted">
            Showing {filteredFAQs.length} of {faqData.length} questions
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-spice-light">
        <div className="max-w-4xl mx-auto px-4">
          {filteredFAQs.length === 0 ? (
            <Card className="border-spice-cream text-center py-12">
              <CardContent>
                <AlertTriangle className="w-12 h-12 text-spice-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-spice-brown mb-2">
                  No questions found
                </h3>
                <p className="text-spice-muted mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="bg-spice-orange hover:bg-spice-orange/90"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-spice-cream">
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleItem(faq.id)}
                      className="w-full"
                    >
                      <CardHeader className="hover:bg-spice-cream/50 transition-colors">
                        <div className="flex items-center justify-between text-left">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-8 h-8 bg-spice-orange rounded-lg flex items-center justify-center mt-1">
                              {getCategoryIcon(faq.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-spice-brown font-display text-lg">
                                {faq.question}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-spice-cream text-spice-brown"
                                >
                                  {faq.category}
                                </Badge>
                                {faq.tags.slice(0, 2).map((tag, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs border-spice-cream text-spice-muted"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          {openItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-spice-muted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-spice-muted" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-white p-4 rounded-lg border border-spice-cream ml-11">
                          <p className="text-spice-muted leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {faq.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-spice-light text-spice-brown"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-spice-orange bg-gradient-to-r from-spice-cream to-spice-light">
            <CardContent className="p-8 text-center">
              <Phone className="w-12 h-12 text-spice-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-spice-brown mb-4 font-display">
                Still Have Questions?
              </h3>
              <p className="text-spice-muted mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help! We typically respond
                to emails within 24 hours and are available by phone during
                business hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-spice-orange hover:bg-spice-orange/90"
                  size="lg"
                  onClick={() => (window.location.href = "/contact")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="border-spice-orange text-spice-orange"
                  size="lg"
                  onClick={() => (window.location.href = "tel:+14082191573")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </div>
              <div className="mt-6 text-sm text-spice-muted">
                <p>📧 hello@thepicklepot.com</p>
                <p>📞 +1 408 219 1573</p>
                <p>🕒 Monday-Friday, 9 AM - 6 PM PST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
