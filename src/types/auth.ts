export type Role = "admin" | "standard";

export interface User {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  role: Role;
}

export interface LoginPayload {
  cpf: string;
  senha: string;
}

export interface SignupPayload {
  nome: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}