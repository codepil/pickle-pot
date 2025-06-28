import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  showNavigation?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

export function Header({
  showNavigation = true,
  showBackButton = false,
  backButtonText = "Back",
  onBackClick,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: userState } = useUser();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-spice-cream z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Promotional Banner */}
        <div className="bg-spice-yellow text-spice-brown text-center py-2 text-sm font-medium">
          FREE DELIVERY ON ORDERS ABOVE $25 | USE CODE: PICKLE25
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center relative">
              <div className="w-8 h-6 bg-white rounded-full relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-spice-brown rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-white rounded-b-full border-2 border-spice-brown"></div>
              </div>
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-spice-brown font-display cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                Pickle Pot
              </h1>
              <p className="text-xs text-spice-muted">
                Authentic • Traditional • Fresh
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {showBackButton && (
              <Button
                variant="outline"
                className="border-spice-orange text-spice-orange"
                onClick={handleBackClick}
              >
                {backButtonText}
              </Button>
            )}

            <div className="flex items-center space-x-2 text-sm text-spice-muted">
              <span>Free Delivery</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-spice-orange text-spice-orange"
              onClick={() =>
                (window.location.href = userState.isAuthenticated
                  ? "/account"
                  : "/auth")
              }
            >
              <User className="w-4 h-4 mr-2" />
              {userState.isAuthenticated
                ? `Hi, ${userState.user?.firstName}`
                : "Account"}
            </Button>

            <Button
              className="bg-spice-orange hover:bg-spice-orange/90"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartState.itemCount})
            </Button>
          </div>

          {/* Mobile Menu Button */}
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
        {showNavigation && (
          <nav className="hidden md:block pb-4">
            <div className="flex items-center justify-center space-x-8">
              <a
                href="/"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                HOME
              </a>
              <a
                href="/pickles"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                PICKLES
              </a>
              <a
                href="/powders"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                POWDERS
              </a>
              <a
                href="/our-story"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                OUR STORY
              </a>
              <a
                href="/contact"
                className="text-spice-muted hover:text-spice-brown transition-colors"
              >
                CONTACT
              </a>
            </div>
          </nav>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-spice-cream py-4">
            <div className="flex flex-col space-y-4">
              {showBackButton && (
                <>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleBackClick}
                  >
                    {backButtonText}
                  </Button>
                  <Separator />
                </>
              )}

              {showNavigation && (
                <>
                  <a href="/" className="text-spice-muted">
                    HOME
                  </a>
                  <a href="/pickles" className="text-spice-muted">
                    PICKLES
                  </a>
                  <a href="/powders" className="text-spice-muted">
                    POWDERS
                  </a>
                  <a href="/our-story" className="text-spice-muted">
                    OUR STORY
                  </a>
                  <a href="/contact" className="text-spice-muted">
                    CONTACT
                  </a>
                  <Separator />
                </>
              )}

              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  (window.location.href = userState.isAuthenticated
                    ? "/account"
                    : "/auth")
                }
              >
                <User className="w-4 h-4 mr-2" />
                {userState.isAuthenticated
                  ? `Hi, ${userState.user?.firstName}`
                  : "Account"}
              </Button>

              <Button
                className="bg-spice-orange hover:bg-spice-orange/90 justify-start"
                onClick={() => (window.location.href = "/cart")}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cartState.itemCount})
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
