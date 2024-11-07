// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthLayout from "@/app/components/AuthLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Bot Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthLayout>{children}</AuthLayout> {/* Wrap in AuthLayout */}
      </body>
    </html>
  );
}
