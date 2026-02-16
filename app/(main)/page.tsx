"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Package,
  LogOut,
  User,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Globe,
  ChevronDown,
  Menu,
  X,
  Zap,
  Shield,
  Eye,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trackShipment } from "@/services/shipment.service";

export default function PublicLandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle admin redirect in useEffect
  useEffect(() => {
    if (session?.user.usertype === "admin") {
      router.push("/admin/dashboard");
    }

    console.log("Session data on landing page:", session?.user);
    // if (session?.user.address === "" || session?.user.phone === "") {
    //   router.push("/client/profile");
    // }
  }, [session, router]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    try {
      setIsTracking(true);
      setShipmentData(null);

      const result = await trackShipment(trackingNumber.trim());

      if (result.success && result.data) {
        setShipmentData(result.data);
        toast.success("Shipment found!");
      } else {
        toast.error(result.error || "Shipment not found");
        setShipmentData(null);
      }
    } catch (error) {
      toast.error("Failed to track shipment");
      setShipmentData(null);
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      in_transit: "bg-blue-100 text-blue-800 border-blue-300",
      out_for_delivery: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "in_transit":
        return <Truck className="w-5 h-5" />;
      case "out_for_delivery":
        return <MapPin className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Dropex</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Services
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                About us
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Contact
              </a>
            </nav>

            {/* Right Side - Language & Auth */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-700">
                <Globe className="w-4 h-4" />
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => router.push("client/profile")}
                    className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => router.push("/client/dashboard")}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleLogin}
                    variant="ghost"
                    className="text-gray-700"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-blue-600 py-2">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 py-2">
                  Services
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 py-2">
                  About us
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 py-2">
                  Blog
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 py-2">
                  Contact
                </a>
                <div className="flex items-center space-x-1 text-gray-700 py-2">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {!session && (
                  <div className="flex space-x-3 pt-2">
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                      className="flex-1"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/register")}
                      className="flex-1 bg-blue-600"
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Your Trusted Delivery Partner
                <span className="text-blue-600 block">
                  On Time, Every Time!
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Whether near or far we ensure your packages arrive safely and
                swiftly. Experience hassle-free courier services tailored to
                your needs.
              </p>

              {/* Tracking Section */}
              {session && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      Know where your package is
                    </span>
                  </div>

                  <form onSubmit={handleTrack} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter Tracking ID"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="flex-1 bg-white"
                      disabled={isTracking}
                    />
                    <Button
                      type="submit"
                      disabled={isTracking}
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                    >
                      {isTracking ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Track Parcel"
                      )}
                    </Button>
                  </form>

                  {/* Shipment Details */}
                  {shipmentData && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          #{shipmentData.trackingNumber}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(shipmentData.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(shipmentData.status)}
                          {formatStatus(shipmentData.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">From</p>
                          <p className="font-medium text-gray-900">
                            {shipmentData.senderCity}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">To</p>
                          <p className="font-medium text-gray-900">
                            {shipmentData.receiverCity}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Weight</p>
                          <p className="font-medium text-gray-900">
                            {shipmentData.packageWeight} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium text-gray-900">
                            {shipmentData.packageType}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Image/Illustration */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-48 h-48 text-blue-600 opacity-50" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Easy Pickup</span>
            </div>

            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">
                Transport Support
              </span>
            </div>

            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-700">Fast Delivery</span>
            </div>

            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-medium text-gray-700">
                Logistics Support
              </span>
            </div>
          </div>

          {/* Additional Features Grid for non-logged in users */}
          {!session && (
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <Zap className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Same-day delivery available in major cities
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <Shield className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  100% Secure
                </h3>
                <p className="text-gray-600">
                  Insurance coverage on all shipments
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <Eye className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Real-time Tracking
                </h3>
                <p className="text-gray-600">
                  Track your package every step of the way
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
