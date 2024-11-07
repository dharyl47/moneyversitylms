// src/app/lib/useAuth.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      router.push("/"); // Redirect to login page if not authenticated
    }
  }, [router]);
};

export default useAuth;
