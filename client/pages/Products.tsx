import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function Products() {
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
                  Authentic • Fresh • Traditional
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-spice-orange text-spice-orange"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-spice-brown mb-6 font-display">
            Our Products
          </h1>
          <p className="text-lg text-spice-muted mb-8 max-w-2xl mx-auto">
            This page is coming soon! We're working on showcasing our complete
            collection of traditional pickles and premium spice powders.
          </p>
          <div className="bg-spice-light rounded-2xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-spice-brown mb-2">
              Under Construction
            </h3>
            <p className="text-spice-muted">
              We're carefully curating our product catalog to bring you the best
              selection.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
