import { Metadata } from "next";
import RegisterClient from "./client";

export const metadata: Metadata = {
  title: "Register | Dropex ",
  description: "Create your Dropex account",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
