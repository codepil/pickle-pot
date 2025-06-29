import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Home,
  Building,
} from "lucide-react";
import { useUser, Address, PaymentMethod } from "@/context/UserContext";

export default function Account() {
  const { state, dispatch, logout } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(
    null,
  );
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showEditAddressDialog, setShowEditAddressDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: state.user?.firstName || "",
    lastName: state.user?.lastName || "",
    email: state.user?.email || "",
    phone: state.user?.phone || "",
    dateOfBirth: state.user?.dateOfBirth || "",
    preferredContactMethod: state.user?.preferredContactMethod || "email",
    preferredContactTime: state.user?.preferredContactTime || "anytime",
  });

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    type: "home",
    isDefault: false,
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  const [paymentForm, setPaymentForm] = useState<Partial<PaymentMethod>>({
    type: "credit",
    isDefault: false,
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cardHolderName: "",
    brand: "visa",
  });

  if (!state.isAuthenticated || !state.user) {
    window.location.href = "/auth";
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleProfileUpdate = () => {
    dispatch({ type: "UPDATE_PROFILE", payload: profileForm });
    alert("Profile updated successfully!");
  };

  const handleAddAddress = () => {
    if (
      !addressForm.firstName ||
      !addressForm.addressLine1 ||
      !addressForm.city
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      type: addressForm.type as "home" | "work" | "other",
      isDefault: addressForm.isDefault || false,
      firstName: addressForm.firstName || "",
      lastName: addressForm.lastName || "",
      addressLine1: addressForm.addressLine1 || "",
      addressLine2: addressForm.addressLine2 || "",
      city: addressForm.city || "",
      state: addressForm.state || "",
      zipCode: addressForm.zipCode || "",
      country: addressForm.country || "United States",
      phone: addressForm.phone,
    };

    dispatch({ type: "ADD_ADDRESS", payload: newAddress });
    resetAddressForm();
    setShowAddressDialog(false);
    alert("Address added successfully!");
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "home",
      isDefault: false,
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      isDefault: address.isDefault,
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
    });
    setShowEditAddressDialog(true);
  };

  const handleUpdateAddress = () => {
    if (
      !addressForm.firstName ||
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !editingAddress
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedAddress: Partial<Address> = {
      type: addressForm.type as "home" | "work" | "other",
      isDefault: addressForm.isDefault || false,
      firstName: addressForm.firstName || "",
      lastName: addressForm.lastName || "",
      addressLine1: addressForm.addressLine1 || "",
      addressLine2: addressForm.addressLine2 || "",
      city: addressForm.city || "",
      state: addressForm.state || "",
      zipCode: addressForm.zipCode || "",
      country: addressForm.country || "United States",
      phone: addressForm.phone,
    };

    dispatch({
      type: "UPDATE_ADDRESS",
      payload: { id: editingAddress.id, address: updatedAddress },
    });
    resetAddressForm();
    setEditingAddress(null);
    setShowEditAddressDialog(false);
    alert("Address updated successfully!");
  };

  const handleAddPaymentMethod = () => {
    if (!paymentForm.cardNumber || !paymentForm.cardHolderName) {
      alert("Please fill in all required fields");
      return;
    }

    const newPayment: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: paymentForm.type as "credit" | "debit",
      isDefault: paymentForm.isDefault || false,
      cardNumber: `****${paymentForm.cardNumber?.slice(-4)}`,
      expiryMonth: paymentForm.expiryMonth || "",
      expiryYear: paymentForm.expiryYear || "",
      cardHolderName: paymentForm.cardHolderName || "",
      brand: paymentForm.brand as "visa" | "mastercard" | "amex" | "discover",
    };

    dispatch({ type: "ADD_PAYMENT_METHOD", payload: newPayment });
    setPaymentForm({
      type: "credit",
      isDefault: false,
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cardHolderName: "",
      brand: "visa",
    });
    setShowPaymentDialog(false);
    alert("Payment method added successfully!");
  };

  return (
    <div className="min-h-screen bg-spice-light">
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
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-spice-orange text-spice-orange"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-spice-brown mb-2 font-display">
            My Account
          </h1>
          <p className="text-spice-muted">
            Welcome back, {state.user.firstName}! Manage your account settings
            and preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-spice-cream">
                  <CardHeader>
                    <CardTitle className="text-spice-brown flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-spice-brown">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          className="border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-spice-brown">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          className="border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-spice-brown">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-spice-brown">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
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
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spice-muted" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileForm.dateOfBirth}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="pl-10 border-spice-cream focus:border-spice-orange"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleProfileUpdate}
                      className="bg-spice-orange hover:bg-spice-orange/90"
                    >
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-spice-cream">
                  <CardHeader>
                    <CardTitle className="text-spice-brown flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Contact Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-spice-brown">
                        Preferred Contact Method
                      </Label>
                      <Select
                        value={profileForm.preferredContactMethod}
                        onValueChange={(value) =>
                          setProfileForm({
                            ...profileForm,
                            preferredContactMethod: value as
                              | "email"
                              | "phone"
                              | "sms",
                          })
                        }
                      >
                        <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="sms">SMS/Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-spice-brown">
                        Preferred Contact Time
                      </Label>
                      <Select
                        value={profileForm.preferredContactTime}
                        onValueChange={(value) =>
                          setProfileForm({
                            ...profileForm,
                            preferredContactTime: value as
                              | "morning"
                              | "afternoon"
                              | "evening"
                              | "anytime",
                          })
                        }
                      >
                        <SelectTrigger className="border-spice-cream focus:border-spice-orange">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            Morning (9AM-12PM)
                          </SelectItem>
                          <SelectItem value="afternoon">
                            Afternoon (12PM-5PM)
                          </SelectItem>
                          <SelectItem value="evening">
                            Evening (5PM-8PM)
                          </SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-xs text-spice-muted">
                      We'll use these preferences for order updates and customer
                      service communications.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card className="border-spice-cream">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-spice-brown flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Addresses
                  </CardTitle>
                  <Dialog
                    open={showAddressDialog}
                    onOpenChange={setShowAddressDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-spice-orange hover:bg-spice-orange/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                          Add a new delivery address to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Address Type</Label>
                          <Select
                            value={addressForm.type}
                            onValueChange={(value) =>
                              setAddressForm({
                                ...addressForm,
                                type: value as "home" | "work" | "other",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="First Name"
                            value={addressForm.firstName}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                firstName: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Last Name"
                            value={addressForm.lastName}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          placeholder="Address Line 1"
                          value={addressForm.addressLine1}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine1: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Address Line 2 (Optional)"
                          value={addressForm.addressLine2}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine2: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                city: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="State"
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                state: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="ZIP"
                            value={addressForm.zipCode}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                zipCode: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          placeholder="Phone (Optional)"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="defaultAddress"
                            checked={addressForm.isDefault}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                isDefault: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="defaultAddress">
                            Set as default address
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddressDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddAddress}
                          className="bg-spice-orange hover:bg-spice-orange/90"
                        >
                          Add Address
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Address Dialog */}
                  <Dialog
                    open={showEditAddressDialog}
                    onOpenChange={setShowEditAddressDialog}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                        <DialogDescription>
                          Update your delivery address information.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Address Type</Label>
                          <Select
                            value={addressForm.type}
                            onValueChange={(value) =>
                              setAddressForm({
                                ...addressForm,
                                type: value as "home" | "work" | "other",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="First Name"
                            value={addressForm.firstName}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                firstName: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Last Name"
                            value={addressForm.lastName}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          placeholder="Address Line 1"
                          value={addressForm.addressLine1}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine1: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Address Line 2 (Optional)"
                          value={addressForm.addressLine2}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine2: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                city: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="State"
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                state: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="ZIP"
                            value={addressForm.zipCode}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                zipCode: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Input
                          placeholder="Phone (Optional)"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="editDefaultAddress"
                            checked={addressForm.isDefault}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                isDefault: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="editDefaultAddress">
                            Set as default address
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowEditAddressDialog(false);
                            resetAddressForm();
                            setEditingAddress(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateAddress}
                          className="bg-spice-orange hover:bg-spice-orange/90"
                        >
                          Update Address
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.user.addresses.map((address) => (
                    <Card key={address.id} className="border-spice-cream">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {address.type === "home" ? (
                              <Home className="w-4 h-4 text-spice-orange" />
                            ) : address.type === "work" ? (
                              <Building className="w-4 h-4 text-spice-orange" />
                            ) : (
                              <MapPin className="w-4 h-4 text-spice-orange" />
                            )}
                            <span className="font-medium text-spice-brown capitalize">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <Badge className="bg-spice-yellow text-spice-brown">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                dispatch({
                                  type: "DELETE_ADDRESS",
                                  payload: address.id,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-spice-muted space-y-1">
                          <p className="font-medium text-spice-brown">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p>{address.addressLine2}</p>
                          )}
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                          {address.phone && <p>{address.phone}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments">
            <Card className="border-spice-cream">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-spice-brown flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                  <Dialog
                    open={showPaymentDialog}
                    onOpenChange={setShowPaymentDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-spice-orange hover:bg-spice-orange/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Add a new payment method to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Card Holder Name"
                          value={paymentForm.cardHolderName}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              cardHolderName: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Card Number"
                          value={paymentForm.cardNumber}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              cardNumber: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <Select
                            value={paymentForm.expiryMonth}
                            onValueChange={(value) =>
                              setPaymentForm({
                                ...paymentForm,
                                expiryMonth: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={String(i + 1).padStart(2, "0")}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={paymentForm.expiryYear}
                            onValueChange={(value) =>
                              setPaymentForm({
                                ...paymentForm,
                                expiryYear: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={String(new Date().getFullYear() + i)}
                                >
                                  {new Date().getFullYear() + i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input placeholder="CVV" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="defaultPayment"
                            checked={paymentForm.isDefault}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                isDefault: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="defaultPayment">
                            Set as default payment method
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowPaymentDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddPaymentMethod}
                          className="bg-spice-orange hover:bg-spice-orange/90"
                        >
                          Add Payment Method
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.user.paymentMethods.map((method) => (
                    <Card key={method.id} className="border-spice-cream">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-spice-orange" />
                            <span className="font-medium text-spice-brown capitalize">
                              {method.brand} {method.type}
                            </span>
                            {method.isDefault && (
                              <Badge className="bg-spice-yellow text-spice-brown">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                dispatch({
                                  type: "DELETE_PAYMENT_METHOD",
                                  payload: method.id,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-spice-muted space-y-1">
                          <p className="font-medium text-spice-brown">
                            {method.cardHolderName}
                          </p>
                          <p>{method.cardNumber}</p>
                          <p>
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
