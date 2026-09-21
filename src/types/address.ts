export interface Address {
  id: number;
  userId: number;
  cep: string;
  logradouro: string;
  numero: string; // string
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  isMain?: boolean;
  createdAt?: string;
}

export interface CreateAddressDTO {
  userId: number;
  cep: string;
  logradouro: string;
  numero: string; // string
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  isMain?: boolean;
}

export interface UpdateAddressDTO {
  cep?: string;
  logradouro?: string;
  numero?: string; // string
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  isMain?: boolean;
}