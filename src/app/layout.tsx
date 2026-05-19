import type { Metadata } from "next";
import type { ReactNode } from "react";
import LegacyScripts from "@/components/LegacyScripts";
import "@/types/iconify";

export const metadata: Metadata = {
  title: "Edudash - School, College & LMS Admin Dashboard",
  description:
    "Modern Education Admin Dashboard for schools, colleges, universities, and eLearning platforms.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" sizes="16x16" />
        <link rel="stylesheet" href="/assets/css/remixicon.css" />
        <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/apexcharts.css" />
        <link rel="stylesheet" href="/assets/css/lib/dataTables.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/flatpickr.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/full-calendar.css" />
        <link rel="stylesheet" href="/assets/css/lib/calendar.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <LegacyScripts />
      </body>
    </html>
  );
}
