import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FarmCast — Agroforestry Weather Dashboard",
  description: "Hyper-local weather intelligence and canopy analysis for Kenyan agroforestry farmers, powered by Weather-AI.",
  keywords: ["weather", "farming", "Kenya", "agroforestry", "forecast", "canopy analysis"],
  authors: [{ name: "Emmanuel Warutere" }],
  openGraph: {
    title: "FarmCast — Agroforestry Weather Dashboard",
    description: "Hyper-local weather intelligence and canopy analysis for Kenyan agroforestry farmers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">{children}</body>
    </html>
  );
}
