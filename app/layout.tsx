import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PUBG Mobile Team Dashboard",
  description: "Team statistics, achievements, and player profiles for our PUBG Mobile team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Sidebar />
        <div className="pl-20">
          {children}
        </div>
      </body>
    </html>
  );
}
