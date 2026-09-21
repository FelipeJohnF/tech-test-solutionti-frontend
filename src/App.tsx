import { useState } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AddressesPage } from "./features/addresses/pages/AddressesPage";
import { AdminPage } from "./features/admin/pages/AdminPage";
import type { User } from "./types/auth";

export default function App() {
  const [currentUser] = useState<User | null>({
    id: "usr_1",
    nome: "Felipe Silva",
    cpf: "123.456.789-00",
    dataNascimento: "01/01/1990",
    role: "admin",
  });

  // Toggle state: 'user-addresses' | 'admin'
  const [currentView, setCurrentView] = useState<"user-addresses" | "admin">("user-addresses");

  return (
    <AppLayout
      user={currentUser}
      onLogout={() => alert("Logout")}
      onAdminClick={() => setCurrentView("admin")}
    >
      {currentView === "admin" ? (
        <AdminPage onBackToUserView={() => setCurrentView("user-addresses")} />
      ) : (
        <AddressesPage />
      )}
    </AppLayout>
  );
}