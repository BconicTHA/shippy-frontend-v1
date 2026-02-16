"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, CheckCircle2, Package } from "lucide-react";
import { register } from "@/services/register.service";

export default function RegisterClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      toast.error("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      toast.error("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        usertype: "client",
      });

      if (result?.success === false) {
        setError(result.error || "Registration failed");
        toast.error(result.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully! Redirecting to login...");

      // Small delay to show the success toast
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200 relative z-10">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-2">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="w-10 h-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Dropex</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Join Dropex to start shipping with confidence
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 text-red-800"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nin Kei"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="ninkei123"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Choose a unique username</p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@chosen.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <PasswordRequirement
                      met={passwordRequirements.minLength}
                      text="8+ characters"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasUpperCase}
                      text="Uppercase letter"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasLowerCase}
                      text="Lowercase letter"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasNumber}
                      text="Number"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2
                    className={`h-4 w-4 ${passwordsMatch ? "text-green-500" : "text-gray-300"}`}
                  />
                  <span
                    className={`text-xs ${passwordsMatch ? "text-green-600" : "text-gray-500"}`}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
                disabled={isLoading}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2
        className={`h-3.5 w-3.5 flex-shrink-0 ${
          met ? "text-green-500" : "text-gray-300"
        }`}
      />
      <span className={`text-xs ${met ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}
