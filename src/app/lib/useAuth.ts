// src/app/lib/useAuth.ts
"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  isSessionActive,
  touchSession,
} from "./authSession";

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

const SESSION_CHECK_INTERVAL_MS = 15 * 1000;

const useAuth = () => {
  const router = useRouter();
  const redirectingRef = useRef(false);

  useEffect(() => {
    const ensureActiveSession = () => {
      if (!isSessionActive()) {
        if (!redirectingRef.current) {
          redirectingRef.current = true;
          clearSession();
          router.replace("/");
        }
        return false;
      }
      return true;
    };

    if (!ensureActiveSession()) {
      return;
    }

    const handleActivity = () => {
      touchSession();
    };

    touchSession();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (ensureActiveSession()) {
          touchSession();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      ensureActiveSession();
    }, SESSION_CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.clearInterval(intervalId);
    };
  }, [router]);
};

export default useAuth;
