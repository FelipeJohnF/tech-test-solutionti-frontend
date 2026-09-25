import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address, CreateAddressDTO, UpdateAddressDTO } from "../../../types/address";
import { addressService } from "../../../services/addressService";
import { AddressCard } from "../components/AddressCard";
import { EditAddressModal } from "../components/EditAddressModal";
import { CreateAddressModal } from "../components/CreateAddressModal";

interface AddressesPageProps {
  userId?: number;
}

export const AddressesPage: React.FC<AddressesPageProps> = ({
  userId = 1, // Fallback ID if not provided by route/context
}) => {
  const queryClient = useQueryClient();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. QUERY: Fetch user addresses by numeric userId
  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => addressService.getAddresses(userId),
    enabled: Boolean(userId),
  });

  // 2. MUTATION: Set address as main
  const setMainMutation = useMutation({
    mutationFn: (id: number) => addressService.setMainAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao definir endereço principal.");
    },
  });

  // 3. MUTATION: Delete address
  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao remover endereço.");
    },
  });

  // 4. MUTATION: Update address
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAddressDTO }) =>
      addressService.updateAddress(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setEditingAddress(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao atualizar endereço.");
    },
  });

  // 5. MUTATION: Create address (self-service — userId is injected here, never chosen by the user)
  const createMutation = useMutation({
    mutationFn: (dto: Omit<CreateAddressDTO, "userId">) =>
      addressService.createAddress({ ...dto, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      setIsCreateModalOpen(false);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao adicionar endereço.");
    },
  });

  // Handlers typed strictly as number
  const handleSetMain = (id: number) => {
    setMainMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Deseja realmente remover este endereço?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveEdit = (updated: Address) => {
    const { id, userId: _uid, createdAt: _created, ...dto } = updated;
    updateMutation.mutate({ id, dto });
  };

  const handleCreate = async (dto: Omit<CreateAddressDTO, "userId">) => {
    await createMutation.mutateAsync(dto);
  };

  const mainAddress = addresses.find((a) => a.isMain);
  const otherAddresses = addresses.filter((a) => !a.isMain);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Meus Endereços
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Visualize seus endereços cadastrados, edite detalhes ou altere o endereço principal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
          >
            + Novo Endereço
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-12 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Carregando seus endereços...
          </div>
        )}

        {/* Error Notice */}
        {isError && !isLoading && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
            <span>{(error as any)?.response?.data?.message || "Falha ao conectar com o servidor."}</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="font-semibold underline hover:text-rose-900 text-xs"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {/* Highlighted Main Address */}
            {mainAddress ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Endereço Principal
                  </h2>
                </div>
                <div className="max-w-xl">
                  <AddressCard
                    address={mainAddress}
                    onEdit={(addr) => setEditingAddress(addr)}
                    onDelete={handleDelete}
                    isFeatured
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-500 bg-white">
                Nenhum endereço principal definido.
              </div>
            )}

            {/* Other Addresses Grid */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Outros Endereços ({otherAddresses.length})
              </h2>

              {otherAddresses.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-500">
                    Nenhum outro endereço secundário cadastrado.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherAddresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onSetMain={handleSetMain}
                      onEdit={(selected) => setEditingAddress(selected)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Address Modal */}
      <EditAddressModal
        isOpen={Boolean(editingAddress)}
        address={editingAddress}
        onClose={() => setEditingAddress(null)}
        onSave={handleSaveEdit}
      />

      {/* Create Address Modal — no userId field, injected automatically from the logged-in user */}
      <CreateAddressModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        loading={createMutation.isPending}
      />
    </div>
  );
};
