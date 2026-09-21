import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignupForm, type SignupDTO } from "../components/SignupForm"; // import the type from SignupForm
import { authService } from "../../../services/authService";
import type { LoginPayload, User } from "../../../types/auth";

interface AuthPageProps {
  onSuccess: (user: User, token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await authService.login(payload);
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || "Falha na autenticação. Verifique os dados inseridos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (payload: SignupDTO) => { // <-- SignupDTO now, not SignupPayload
    setLoading(true);
    setAuthError("");
    try {
      const res = await authService.signup(payload);
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || "Erro ao registrar a conta. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setAuthError("");
            }}
            className={`flex-1 py-2.5 text-center text-sm font-semibold border-b-2 transition-all ${
              mode === "login"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setAuthError("");
            }}
            className={`flex-1 py-2.5 text-center text-sm font-semibold border-b-2 transition-all ${
              mode === "signup"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {authError}
          </div>
        )}

        {mode === "login" ? (
          <LoginForm onSubmit={handleLogin} loading={loading} />
        ) : (
          <SignupForm onSubmit={handleSignup} loading={loading} />
        )}
      </div>
    </div>
  );
};
