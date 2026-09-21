import React from "react";

export type AdminTab = "visualization" | "config";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onBackToUserView: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onBackToUserView,
}) => {
  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Administração
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">Painel de Controle</h2>
        </div>

        <nav className="space-y-1.5 font-sans">
          <button
            type="button"
            onClick={() => onTabChange("visualization")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "visualization"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="text-sm">📊</span>
            Visualização
          </button>

          <button
            type="button"
            onClick={() => onTabChange("config")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "config"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="text-sm">⚙️</span>
            Configurações
          </button>
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-100 mt-6 md:mt-0">
        <button
          type="button"
          onClick={onBackToUserView}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          ← Voltar para Meus Endereços
        </button>
      </div>
    </aside>
  );
};