import type { Metadata } from "next";
import "./globals.css";
import "../utils/base.css";
import { Outfit } from "next/font/google";
import Header from "@/components/Header/Header";

const outfit = Outfit({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  title: "My App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
