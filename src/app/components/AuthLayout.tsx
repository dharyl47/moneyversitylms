// src/app/components/AuthLayout.tsx
"use client";
import useAuth from "../lib/useAuth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  useAuth();
  return <>{children}</>;
}
