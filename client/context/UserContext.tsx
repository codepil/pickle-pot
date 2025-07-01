import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { authApi, userApi } from "@/lib/api";
import { setAuthToken, removeAuthToken } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  preferredContactMethod: "email" | "phone" | "sms";
  preferredContactTime: "morning" | "afternoon" | "evening" | "anytime";
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: string;
}

interface Address {
  id: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface PaymentMethod {
  id: string;
  type: "credit" | "debit";
  isDefault: boolean;
  cardNumber: string; // Last 4 digits only
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
  brand: "visa" | "mastercard" | "amex" | "discover";
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type UserAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "ADD_ADDRESS"; payload: Address }
  | {
      type: "UPDATE_ADDRESS";
      payload: { id: string; address: Partial<Address> };
    }
  | { type: "DELETE_ADDRESS"; payload: string }
  | { type: "ADD_PAYMENT_METHOD"; payload: PaymentMethod }
  | {
      type: "UPDATE_PAYMENT_METHOD";
      payload: { id: string; method: Partial<PaymentMethod> };
    }
  | { type: "DELETE_PAYMENT_METHOD"; payload: string };

// Load initial state from localStorage
const loadInitialState = (): UserState => {
  // Check if running in browser (not SSR)
  if (typeof window === "undefined") {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  try {
    const savedUser = localStorage.getItem("picklepot_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return {
        user,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

const initialState: UserState = loadInitialState();

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
} | null>(null);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };

    case "LOGIN_SUCCESS":
      // Save user to localStorage (only in browser)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "picklepot_user",
            JSON.stringify(action.payload),
          );
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
        }
      }
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      // Clear user from localStorage (only in browser)
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("picklepot_user");
        } catch (error) {
          console.error("Error clearing user from localStorage:", error);
        }
      }
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "UPDATE_PROFILE":
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      // Save updated user to localStorage (only in browser)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("picklepot_user", JSON.stringify(updatedUser));
        } catch (error) {
          console.error("Error saving updated user to localStorage:", error);
        }
      }
      return {
        ...state,
        user: updatedUser,
      };

    case "ADD_ADDRESS":
      if (!state.user) return state;
      const userWithNewAddress = {
        ...state.user,
        addresses: [...state.user.addresses, action.payload],
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithNewAddress),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithNewAddress,
      };

    case "UPDATE_ADDRESS":
      if (!state.user) return state;
      const userWithUpdatedAddress = {
        ...state.user,
        addresses: state.user.addresses.map((addr) =>
          addr.id === action.payload.id
            ? { ...addr, ...action.payload.address }
            : addr,
        ),
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithUpdatedAddress),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithUpdatedAddress,
      };

    case "DELETE_ADDRESS":
      if (!state.user) return state;
      const userWithDeletedAddress = {
        ...state.user,
        addresses: state.user.addresses.filter(
          (addr) => addr.id !== action.payload,
        ),
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithDeletedAddress),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithDeletedAddress,
      };

    case "ADD_PAYMENT_METHOD":
      if (!state.user) return state;
      const userWithNewPayment = {
        ...state.user,
        paymentMethods: [...state.user.paymentMethods, action.payload],
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithNewPayment),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithNewPayment,
      };

    case "UPDATE_PAYMENT_METHOD":
      if (!state.user) return state;
      const userWithUpdatedPayment = {
        ...state.user,
        paymentMethods: state.user.paymentMethods.map((method) =>
          method.id === action.payload.id
            ? { ...method, ...action.payload.method }
            : method,
        ),
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithUpdatedPayment),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithUpdatedPayment,
      };

    case "DELETE_PAYMENT_METHOD":
      if (!state.user) return state;
      const userWithDeletedPayment = {
        ...state.user,
        paymentMethods: state.user.paymentMethods.filter(
          (method) => method.id !== action.payload,
        ),
      };
      // Save updated user to localStorage
      try {
        localStorage.setItem(
          "picklepot_user",
          JSON.stringify(userWithDeletedPayment),
        );
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
      return {
        ...state,
        user: userWithDeletedPayment,
      };

    default:
      return state;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authApi.login({ email, password });

      // Store auth token
      if (response.token) {
        setAuthToken(response.token);
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authApi.register(userData);

      // Store auth token
      if (response.token) {
        setAuthToken(response.token);
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and token
      removeAuthToken();
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <UserContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export type { User, Address, PaymentMethod };
