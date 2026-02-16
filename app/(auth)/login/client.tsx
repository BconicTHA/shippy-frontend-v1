"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Package } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setServerError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        if (session?.user?.usertype === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }

      router.refresh();
    } catch (error) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
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

          <CardTitle className="text-2xl text-center font-bold text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 text-red-800"
              >
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <FieldGroup className="space-y-4">
              {/* Email */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Email Address
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="user@chosen.com"
                  disabled={isSubmitting}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password */}
              <Field>
                <div className="flex justify-between items-center">
                  <FieldLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
