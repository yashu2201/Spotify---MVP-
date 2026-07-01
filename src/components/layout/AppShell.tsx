"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { StoreProvider, useStore } from "@/components/store/StoreProvider";
import { Sidebar } from "./Sidebar";

function MobileBackdrop() {
  const { sidebarOpen, setSidebarOpen } = useStore();
  if (!sidebarOpen) return null;
  return (
    <div
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black/60 z-40 md:hidden"
      aria-hidden="true"
    />
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, mounted } = useAuth();

  // Avoid a hydration flash before localStorage is read.
  if (!mounted) {
    return <div className="flex-1 bg-brand-dark" />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <StoreProvider>
      <Sidebar />
      <MobileBackdrop />
      <div className="flex-1 overflow-y-auto relative w-full">{children}</div>
    </StoreProvider>
  );
}
