import React from "react";
import { Header } from "../components/Header";
import type { User } from "../types/auth";

interface AppLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  onAdminClick?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  user,
  onLogout,
  onAdminClick,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header user={user} onLogout={onLogout} onAdminClick={onAdminClick} />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};