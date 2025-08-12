import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  ChefHat,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state, login, register } = useUser();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      window.location.href = "/account";
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      await register(registerForm);
      window.location.href = "/account";
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  if (state.isAuthenticated) {
    window.location.href = "/account";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spice-light to-spice-cream">
      {/* Header */}
      <header className="bg-white border-b border-spice-cream">
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
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
        <div className="w-full max-w-md">
          <Card className="border-spice-cream shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-spice-brown font-display">
                Welcome to Pickle Pot
              </CardTitle>
              <p className="text-spice-muted">
                Sign in to your account or create a new one to start shopping
              </p>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-spice-brown">
                        Email Address
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="login-password"
                        className="text-spice-brown"
                      >
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10 border-spice-cream focus:border-spice-orange"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spice-muted hover:text-spice-brown"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 text-spice-muted">
                        <input type="checkbox" className="rounded" />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-spice-orange hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-spice-orange hover:bg-spice-orange/90"
                      disabled={state.isLoading}
                    >
                      {state.isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="text-center text-sm text-spice-muted">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setActiveTab("register")}
                        className="text-spice-orange hover:underline font-medium"
                      >
                        Sign up here
                      </button>
                    </div>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-spice-brown">
                          First Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={registerForm.firstName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                firstName: e.target.value,
                              })
                            }
                            className="pl-10 border-spice-cream focus:border-spice-orange"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="text-spice-brown">
                          Last Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={registerForm.lastName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                lastName: e.target.value,
                              })
                            }
                            className="pl-10 border-spice-cream focus:border-spice-orange"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="register-email"
                        className="text-spice-brown"
                      >
                        Email Address
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerForm.email}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              email: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-spice-brown">
                        Phone Number
                      </Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={registerForm.phone}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              phone: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth" className="text-spice-brown">
                        Date of Birth
                      </Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={registerForm.dateOfBirth}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="register-password"
                        className="text-spice-brown"
                      >
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10 border-spice-cream focus:border-spice-orange"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spice-muted hover:text-spice-brown"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-spice-brown"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pl-10 pr-10 border-spice-cream focus:border-spice-orange"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spice-muted hover:text-spice-brown"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-spice-muted">
                      By creating an account, you agree to our{" "}
                      <a href="#" className="text-spice-orange hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-spice-orange hover:underline">
                        Privacy Policy
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-spice-orange hover:bg-spice-orange/90"
                      disabled={state.isLoading}
                    >
                      {state.isLoading
                        ? "Creating Account..."
                        : "Create Account"}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="text-center text-sm text-spice-muted">
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-spice-orange hover:underline font-medium"
                      >
                        Sign in here
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-spice-muted">
            Need help?{" "}
            <a href="/contact" className="text-spice-orange hover:underline">
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
