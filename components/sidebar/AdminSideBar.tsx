"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Settings,
  Home,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Shipments",
    href: "/admin/shipments",
    icon: Package,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Package className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Dropex</span>
          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
            Admin
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-100 transform transition-all duration-300 ease-in-out flex flex-col",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
        )}
      >
        {/* Logo - Desktop Only */}
        <div
          className={cn(
            "hidden lg:flex items-center border-b border-gray-100 transition-all duration-300",
            isCollapsed
              ? "justify-center px-2 py-6"
              : "justify-between px-6 py-6",
          )}
        >
          {!isCollapsed ? (
            <>
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      Dropex
                    </span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Management Portal
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold mt-2">
                  Admin
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(false)}
                className="hover:bg-gray-100 absolute -right-3 top-6 bg-white border border-gray-200 rounded-full shadow-md"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </Button>
            </>
          )}
        </div>

        {/* Home Link */}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 px-4 py-4 space-y-1 overflow-y-auto",
            isCollapsed && "lg:px-2",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center rounded-lg transition-all duration-200 group",
                  isCollapsed
                    ? "justify-center px-2 py-3"
                    : "space-x-3 px-4 py-3",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-gray-700",
                  )}
                />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div
          className={cn(
            "border-t border-gray-100",
            isCollapsed ? "px-2 py-6" : "px-4 py-6",
          )}
        >
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-lg transition-colors duration-200 group",
              isCollapsed
                ? "justify-center px-2 py-3 hover:bg-red-50"
                : "space-x-3 px-4 py-3 hover:bg-red-50",
            )}
          >
            <LogOut
              className={cn(
                "w-5 h-5",
                isCollapsed
                  ? "text-red-500"
                  : "text-red-500 group-hover:text-red-600",
              )}
            />
            {!isCollapsed && (
              <>
                <span className="font-medium text-red-500 group-hover:text-red-600">
                  Logout
                </span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-40">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs mt-1">Exit</span>
          </button>
        </div>
      </div>
    </>
  );
}
