import { Metadata } from "next";
import LoginClient from "./client";

export const metadata: Metadata = {
  title: "Login | Dropex",
  description: "Login to your Dropex",
};

export default function LoginPage() {
  return <LoginClient />;
}
