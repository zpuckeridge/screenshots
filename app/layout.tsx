import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
  applicationName: "screenshots.arma.zsu.gg",
  generator: "Next.js",
  keywords: [
    "zsu",
    "arma",
    "zsu arma screenshots",
    "screenshots",
    "arma screenshots",
    "screenshots arma",
    "screenshots arma zsu",
  ],
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  icons: {
    icon: "/avatar.jpg",
  },
  appleWebApp: {
    title: "screenshots.arma.zsu.gg",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  title: {
    default: "Screenshots — ZSU ArmA 3",
    template: "%s — ZSU ArmA 3",
  },
  description: siteConfig.description,
  openGraph: {
    url: siteConfig.url,
    title: "Screenshots — ZSU ArmA 3",
    description: siteConfig.description,
    siteName: "screenshots.arma.zsu.gg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "flex min-h-screen flex-col dark:bg-[#111111] bg-white",
            inter.className
          )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <Navigation />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
