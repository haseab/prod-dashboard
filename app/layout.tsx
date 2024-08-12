import { PHProvider } from "@/components/posthog-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "timetracking.live",
  description: "See what Haseab is up to 24/7",
  keywords: "timetracking, haseab, live timetracking, haseab live",
  icons: "/favicon.ico",
  openGraph: {
    type: "website",
    url: "https://timetracking.live",
    title: "timetracking.live",
    description: "See what Haseab is up to 24/7",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "timetracking.live",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>timetracking.live</title>
        <meta name="description" content="see what haseab is up to 24/7" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta
          name="keywords"
          content="timetracking, haseab, live timetracking, haseab live"
        />
        <meta property="og:title" content="timetracking.live" />
        <meta
          property="og:description"
          content="see what haseab is up to 24/7"
        />
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:url" content="https://timetracking.live" />
        <link rel="canonical" href="https://timetracking.live" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}
