import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: {
    default: "AI Automation Content",
    template: "%s | AI Automation Content",
  },
  description: "Instagram Content Automation Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader title="Automation Dashboard" />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
