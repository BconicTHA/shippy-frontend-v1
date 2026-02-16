"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Users,
  Clock,
  CheckCircle,
  Truck,
  TrendingUp,
  LogOut,
  ChevronDown,
  User,
  Home,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShipmentTable from "@/components/shipment/ShipmentTable";
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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ShipmentStats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.usertype !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.usertype === "admin") {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);

      // Fetch stats using service layer
      const statsResult = await getShipmentStats(session.accessToken);
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Fetch all shipments using service layer
      const shipmentsResult = await getAllShipments(session.accessToken);
      if (shipmentsResult.success) {
        setShipments(shipmentsResult.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      trend: "+12% from last month",
    },
    {
      title: "Active Users",
      value: "156", // This would come from a users API
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      trend: "+8 new this week",
    },
    {
      title: "In Transit",
      value: stats?.inTransit || 0,
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "Active deliveries",
    },
    {
      title: "Delivered",
      value: stats?.delivered || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: `${stats?.delivered || 0} completed`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-end">
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Shield className="w-4 h-4 text-red-600" />
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all shipments, track system performance, and monitor user
            activity
          </p>
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
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      {stat.trend}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All Shipments Table */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                All Shipments
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Total: {shipments.length} shipments
                </div>
                <Button
                  onClick={fetchDashboardData}
                  variant="outline"
                  size="sm"
                  className="border-gray-300"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ShipmentTable
              shipments={shipments}
              isAdmin={true}
              onRefresh={fetchDashboardData}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
