import { apiClient } from "./apiClient";
import type { Address, CreateAddressDTO, UpdateAddressDTO } from "../types/address";
import { stripMask } from "../utils/masks";

export const addressService = {
  // GET /enderecos?userId=1
  async getAddresses(userId: number): Promise<Address[]> {
      const response = await apiClient.get<Address[]>(`/enderecos/userId/${userId}`);
      return response.data;
  },

  // POST /enderecos
  async createAddress(dto: CreateAddressDTO): Promise<Address> {
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

  // PATCH /enderecos/:id/main
  async setMainAddress(id: number): Promise<Address> {
    const response = await apiClient.patch<Address>(`/enderecos/${id}/main`);
    return response.data;
  },

  // DELETE /enderecos/:id
  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/enderecos/${id}`);
  },

    async getAddressesByUserId(userId: number): Promise<Address[]>{

        const response = await apiClient.get<Address[]>(`/enderecos/userId/${userId}`)
        return response.data;
  }
};