import { apiClient } from "./apiClient";
import type { User, SignupPayload } from "../types/auth";
import type { Address, CreateAddressDTO, UpdateAddressDTO } from "../types/address";
import { stripMask, formatToYYYYMMDD } from "../utils/masks";
import {normalizeUser} from "../utils/normalizeUser";

export const adminService = {
  // GET /users
async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users");
    return response.data.map(normalizeUser);
},

  // POST /users
    async createUser(data: SignupPayload & { role: "admin" | "standard" }): Promise<User> {
      const { confirmarSenha, ...baseData } = data as any;

      const payload = {
        ...baseData,
        cpf: stripMask(data.cpf),
        dataNascimento: formatToYYYYMMDD(data.dataNascimento), // Faz a conversão apenas UMA vez aqui
        role: data.role || "standard",
      };

      const response = await apiClient.post<User>("/users", payload);
      return response.data;
    },

  // GET /enderecos
    async getAllAddresses(): Promise<Address[]> {
        const response = await apiClient.get<Address[]>("/enderecos");
        return response.data;
    },

  // GET /enderecos?userId=1
    async getEnderecosByUserId(userId: number): Promise<Address[]> {
        const response = await apiClient.get<Address[]>("/enderecos", {
        params: { userId },
    });

        return response.data;
    },

  // POST /enderecos
    async createAddressForUser(dto: CreateAddressDTO): Promise<Address> {
        const payload: CreateAddressDTO = {
        ...dto,
        cep: stripMask(dto.cep),
        };
        const response = await apiClient.post<Address>("/enderecos", payload);
        return response.data;
    },

  // PUT /enderecos/:id
    async updateAddress(id: number, dto: UpdateAddressDTO): Promise<Address> {
        const payload: UpdateAddressDTO = {
        ...dto,
        ...(dto.cep ? { cep: stripMask(dto.cep) } : {}),
        };

        const response = await apiClient.put<Address>(`/enderecos/${id}`, payload);
        return response.data;
  },

  // DELETE /enderecos/:id
    async deleteAddress(id: number): Promise<void> {
        await apiClient.delete(`/enderecos/${id}`);
    },
};