import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#E4E7E4] flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-10 overflow-y-auto min-w-0 max-w-full">
        <div className="max-w-6xl mx-auto min-w-0 w-full">{children}</div>
      </div>
    </div>
  );
}
