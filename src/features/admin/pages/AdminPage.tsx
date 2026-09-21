import React, { useState } from "react";
import { AdminSidebar, type AdminTab } from "../components/AdminSidebar";
import { VisualizationView } from "../components/VisualizationView";
import { ConfigView } from "../components/ConfigView";

interface AdminPageProps {
  onBackToUserView: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToUserView }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("visualization");

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackToUserView={onBackToUserView}
      />

      <section className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === "visualization" ? <VisualizationView /> : <ConfigView />}
        </div>
      </section>
    </div>
  );
};