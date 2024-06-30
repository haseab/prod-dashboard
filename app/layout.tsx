import { PHProvider } from "@/components/posthog-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Productivity Dashboard",
  description: "See Haseabs timetracking metrics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {<PHProvider>children</PHProvider>}
      </body>
    </html>
  );
}
