import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSideBar";

export async function Sidebar() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return session.user.usertype === "admin" ? (
    <>
      <AdminSidebar />
    </>
  ) : (
    <></>
  );
}
