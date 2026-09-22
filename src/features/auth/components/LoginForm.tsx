import React, { useState } from "react";
import { Input } from "../../../components/Input";
import type { LoginPayload } from "../../../types/auth";
import { maskCPF, stripMask } from "../../../utils/masks";

interface LoginFormProps {
  onSubmit: (data: LoginPayload) => Promise<void> | void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<LoginPayload>({ cpf: "", senha: "" });
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (stripMask(formData.cpf).length !== 11) {
      setError("O CPF deve conter exatamente 11 dígitos.");
      return;
    }

     onSubmit({ ...formData, cpf: stripMask(formData.cpf) })
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="CPF"
        id="login-cpf"
        placeholder="000.000.000-00"
        value={formData.cpf}
        onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
        required
      />

      <Input
        label="Senha"
        id="login-senha"
        type="password"
        placeholder="••••••••"
        value={formData.senha}
        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};