"use client";

import { useState } from "react";
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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trackShipment } from "@/services/shipment.service";

export default function ClientLandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [shipmentData, setShipmentData] = useState<any>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  SwiftShip
                </h1>
                <p className="text-xs text-slate-500">
                  Express Courier Service
                </p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-lg">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => router.push("/client/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Ship Your Packages
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h2>

            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Fast, reliable, and secure courier services. Send your packages
              anywhere, anytime. Track every step of the journey.
            </p>

            {/* Tracking Form - Only show when logged in */}
            {session && (
              <div className="mb-12">
                <Card className="max-w-2xl mx-auto shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-blue-600" />
                      Track Your Shipment
                    </h3>

                    <form onSubmit={handleTrack} className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          placeholder="Enter tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="flex-1 text-lg h-12"
                          disabled={isTracking}
                        />
                        <Button
                          type="submit"
                          disabled={isTracking}
                          className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                        >
                          {isTracking ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Tracking...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Track
                            </>
                          )}
                        </Button>
                      </div>
                    </form>

                    {/* Shipment Details */}
                    {shipmentData && (
                      <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg text-slate-900">
                            Tracking: {shipmentData.trackingNumber}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(shipmentData.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(shipmentData.status)}
                            {formatStatus(shipmentData.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              From
                            </p>
                            <p className="text-slate-900 font-semibold">
                              {shipmentData.senderName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {shipmentData.senderCity},{" "}
                              {shipmentData.senderCountry}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              To
                            </p>
                            <p className="text-slate-900 font-semibold">
                              {shipmentData.receiverName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {shipmentData.receiverCity},{" "}
                              {shipmentData.receiverCountry}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Package Type
                            </p>
                            <p className="text-slate-900">
                              {shipmentData.packageType}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Weight
                            </p>
                            <p className="text-slate-900">
                              {shipmentData.packageWeight} kg
                            </p>
                          </div>

                          {shipmentData.estimatedDelivery && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-slate-500">
                                Estimated Delivery
                              </p>
                              <p className="text-slate-900">
                                {new Date(
                                  shipmentData.estimatedDelivery,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-slate-600">
                  Same-day delivery available in major cities
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  100% Secure
                </h3>
                <p className="text-sm text-slate-600">
                  Insurance coverage on all shipments
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Real-time Tracking
                </h3>
                <p className="text-sm text-slate-600">
                  Track your package every step of the way
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
