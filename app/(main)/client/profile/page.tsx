"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Home,
  Package,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/profile.service";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  usertype: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = session?.accessToken;

      if (!token) return;

      const result = await getProfile(token);

      if (result.success && result.data) {
        setProfile(result.data);
        setName(result.data.name);
        setPhone(result.data.phone);
        setAddress(result.data.address);
      } else {
        toast.error(result.error || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const token = session?.accessToken;

      if (!token) return;

      const result = await updateProfile(token, {
        name,
        phone,
        address,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setAddress(profile.address);
    }
    setIsEditing(false);
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
              <div className="hidden md:flex items-center space-x-1 text-gray-700">
                <span className="text-sm font-medium text-gray-600">
                  {session?.user?.name || session?.user?.email}
                </span>
                <ChevronDown className="w-4 h-4" />
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Name - Editable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-2">
                Full Name *
              </label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.name}
                </p>
              )}
            </div>

            {/* Username - Not Editable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-2">
                Username
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-700 font-medium">
                  @{profile?.username}
                </p>
              </div>
            </div>

            {/* Email - Not Editable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-700">{profile?.email}</p>
              </div>
            </div>

            {/* Phone - Editable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-white"
                />
              ) : (
                <p className="text-gray-700">
                  {profile?.phone || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              )}
            </div>

            {/* Address - Editable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Delivery Address
              </label>
              {isEditing ? (
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  rows={4}
                  className="bg-white"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {profile?.address || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updating}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
