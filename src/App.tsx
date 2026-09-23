import { useState, useEffect } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { AddressesPage } from "./features/addresses/pages/AddressesPage";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { AuthPage } from "./features/auth/pages/AuthPage";
import type { User } from "./types/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Toggle state: 'user-addresses' | 'admin'
  const [currentView, setCurrentView] = useState<"user-addresses" | "admin">("user-addresses");

  // On app load, try to restore a previous session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsLoadingSession(false);
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setCurrentView("user-addresses");
  };

  // Avoid a flash of the login screen while checking localStorage
  if (isLoadingSession) {
    return null; // or a small loading spinner if you have one
  }

  // Not logged in -> show login/signup, nothing else
  if (!currentUser) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <AppLayout
      user={currentUser}
      onLogout={handleLogout}
      onAdminClick={() => setCurrentView("admin")}
    >
      {currentView === "admin" && currentUser.role === "admin" ? (
        <AdminPage onBackToUserView={() => setCurrentView("user-addresses")} />
      ) : (
        <AddressesPage userId={currentUser.id} /> // <-- pass the real logged-in user's id
      )}
    </AppLayout>
  );
}