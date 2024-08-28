import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { SyncActiveOrganization } from "./utils/sync-active-organization";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kno Global",
  description:
    "Connecting suppliers and making their data accessible to brands. Includes data for compliance, health of the factory, its capacity, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <SyncActiveOrganization />

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
