"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  ArrowLeft,
  Home,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShipmentTable from "@/components/shipment/ShipmentTable";
import CreateShipmentModal from "@/components/shipment/ShipmentModal";
import { getShipmentStats, getAllShipments } from "@/services/shipment.service";

interface ShipmentStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ShipmentStats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchDashboardData = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);

      // Fetch stats using service layer
      const statsResult = await getShipmentStats(session.accessToken);
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Fetch shipments using service layer
      const shipmentsResult = await getAllShipments(session.accessToken);
      if (shipmentsResult.success) {
        setShipments(shipmentsResult.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session?.user, fetchDashboardData]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Shipments",
      value: stats?.total || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "All time shipments",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Awaiting processing",
    },
    {
      title: "In Transit",
      value: stats?.inTransit || 0,
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "On the way",
    },
    {
      title: "Delivered",
      value: stats?.delivered || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Successfully delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Dropex</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div
                onClick={() => router.push("/client/profile")}
                className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-blue-600">{session?.user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all your shipments in one place
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Shipment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stat.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Shipments Table */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Your Shipments
              </CardTitle>
              <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Total: {shipments.length} shipments
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ShipmentTable
              shipments={shipments}
              isAdmin={false}
              onRefresh={fetchDashboardData}
            />
          </CardContent>
        </Card>
      </main>

      {/* Create Shipment Modal */}
      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
