import React from "react";
import type { User } from "../types/auth";

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onAdminClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            A
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            AddressManager
          </span>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Button */}
            <button
              type="button"
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Painel Admin
            </button>

            {/* User Info */}
            <div className="text-right hidden sm:block border-l border-slate-200 pl-3">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user.nome}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">{user.cpf}</p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sair
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};