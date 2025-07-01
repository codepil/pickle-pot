import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { cartApi } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  originalPrice?: string;
  image: string;
  size: string;
  quantity: number;
  deliveryDate?: string;
  category: "pickle" | "powder";
  badge?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SYNC_WITH_SERVER"; payload: any };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  syncWithServer: () => Promise<void>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size,
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const total = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace("$", ""))
            : item.price;
        return sum + price * item.quantity;
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: Math.round(total * 100) / 100,
        itemCount,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace("$", ""))
            : item.price;
        return sum + price * item.quantity;
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: Math.round(total * 100) / 100,
        itemCount,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);

      const total = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace("$", ""))
            : item.price;
        return sum + price * item.quantity;
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: Math.round(total * 100) / 100,
        itemCount,
      };
    }

    case "CLEAR_CART":
      return initialState;

    case "SYNC_WITH_SERVER": {
      // Convert server cart format to local cart format
      const serverCart = action.payload;
      const convertedItems: CartItem[] =
        serverCart.items?.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          originalPrice: item.variant.originalPrice,
          image: item.product.images?.[0]?.url || "/placeholder.svg",
          size: item.variant.size,
          quantity: item.quantity,
          category: item.product.category.name.toLowerCase().includes("pickle")
            ? "pickle"
            : "powder",
          badge: item.product.isFeatured ? "Featured" : undefined,
        })) || [];

      const total = convertedItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace("$", ""))
            : item.price;
        return sum + price * item.quantity;
      }, 0);

      return {
        items: convertedItems,
        total: Math.round(total * 100) / 100,
        itemCount: convertedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync cart with server
  const syncWithServer = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return; // No auth, use local cart only

      const serverCart = await cartApi.getCart();

      // Update local state with server cart
      if (serverCart && serverCart.items) {
        dispatch({ type: "SYNC_WITH_SERVER", payload: serverCart });
      }
    } catch (error) {
      console.error("Cart sync error:", error);
      // Continue with local cart if server sync fails
    }
  };

  // Sync cart on mount if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      syncWithServer();
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch, syncWithServer }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export type { CartItem };
