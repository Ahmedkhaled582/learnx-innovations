import type { ReactNode } from "react";
import ThemeCustomization from "@/components/ThemeCustomization";
import MobileOverlay from "@/components/MobileOverlay";
import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeCustomization />
      <MobileOverlay />
      <Sidebar />
      <main className="dashboard-main">
        <DashboardNavbar />
        <div className="dashboard-main-body">{children}</div>
        <DashboardFooter />
      </main>
    </>
  );
}
