import React, { useState } from "react";
import { Input } from "../../../components/Input";
import type { SignupPayload } from "../../../types/auth";
import { maskCPF, maskDate, stripMask, formatToYYYYMMDD } from "../../../utils/masks";
import { isValidCPF } from "../../../utils/validators";

// The payload sent to the API does not need 'confirmarSenha'
export type SignupDTO = Omit<SignupPayload, "confirmarSenha">;

interface SignupFormProps {
  onSubmit: (data: SignupDTO) => Promise<void> | void;
  loading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<SignupPayload>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    senha: "",
    confirmarSenha: ""
  });
  
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. Length check first, then mathematical Modulo 11 check
    if (stripMask(formData.cpf).length !== 11) {
      setError("O CPF deve conter exatamente 11 dígitos.");
      return;
    }
    if (!isValidCPF(formData.cpf)) {
      setError("O CPF informado é inválido.");
      return;
    }

    // 2. Date of birth check
    if (stripMask(formData.dataNascimento).length !== 8) {
      setError("A data de nascimento deve estar no formato DD/MM/AAAA.");
      return;
    }

    // 3. Password checks
    if (formData.senha.length < 6) {
      setError("A senha deve conter ao menos 6 caracteres.");
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    // 4. Build payload excluding 'confirmarSenha' and formatting date with hyphens
    const { confirmarSenha, ...baseData } = formData;

    const payload: SignupDTO = {
      ...baseData,
      cpf: stripMask(formData.cpf),
      dataNascimento: formatToYYYYMMDD(formData.dataNascimento)
    };

    console.log("Submitting payload:", payload);

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Nome Completo"
        id="signup-nome"
        placeholder="Nome e Sobrenome"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="CPF"
          id="signup-cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
          required
        />
        <Input
          label="Data de Nascimento"
          id="signup-nascimento"
          placeholder="DD/MM/AAAA"
          value={formData.dataNascimento}
          onChange={(e) => setFormData({ ...formData, dataNascimento: maskDate(e.target.value) })}
          required
        />
      </div>

      <Input
        label="Senha"
        id="signup-senha"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={formData.senha}
        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
        required
      />

      <Input
        label="Confirmar Senha"
        id="signup-confirmar-senha"
        type="password"
        placeholder="Repita a senha"
        value={formData.confirmarSenha}
        onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
      >
        {loading ? "Cadastrando..." : "Criar Conta"}
      </button>
    </form>
  );
};