import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../../services/adminService";
import { Input } from "../../../components/Input";
import { EditAddressModal } from "../../addresses/components/EditAddressModal";
import type { Address, CreateAddressDTO, UpdateAddressDTO } from "../../../types/address";
import type { Role } from "../../../types/auth";
import { maskCEP, maskCPF, maskDate, stripMask } from "../../../utils/masks";
import { isValidCPF } from "../../../utils/validators";

export const ConfigView: React.FC = () => {
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState<"manage-addresses" | "add-address" | "add-user">("manage-addresses");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: adminService.getAllUsers,
  });

  const { data: addresses = [], isLoading: loadingAddresses } = useQuery({
    queryKey: ["enderecos"],
    queryFn: adminService.getAllAddresses,
  });

  const [addressForm, setAddressForm] = useState<Omit<CreateAddressDTO, "userId"> & { userId: number | "" }>({
    userId: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    isMain: false,
  });

  const [userForm, setUserForm] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    role: "standard" as Role,
    senha: "",
  });

  const createAddressMutation = useMutation({
    mutationFn: (dto: CreateAddressDTO) => adminService.createAddressForUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enderecos"] });
      alert("Endereço salvo com sucesso em /enderecos!");
      setAddressForm({
        userId: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        isMain: false,
      });
      setActivePanel("manage-addresses");
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao cadastrar endereço.");
    },
  });

  const createUserMutation = useMutation({
      mutationFn: (data: any) => adminService.createUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        alert("Usuário salvo com sucesso em /users!");
        setUserForm({ nome: "", cpf: "", dataNascimento: "", role: "standard", senha: "" });
        setActivePanel("manage-addresses");
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Erro ao cadastrar usuário.");
      },
    });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enderecos"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao excluir endereço.");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAddressDTO }) =>
      adminService.updateAddress(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enderecos"] });
      setEditingAddress(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao atualizar endereço.");
    },
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (addressForm.userId === "" || isNaN(Number(addressForm.userId))) {
      alert("Por favor, selecione um usuário para vincular o endereço.");
      return;
    }

    createAddressMutation.mutate({
      ...addressForm,
      userId: Number(addressForm.userId),
      numero: addressForm.numero, // passes clean string
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCPF = stripMask(userForm.cpf);
    const cleanBirth = stripMask(userForm.dataNascimento);

    // 1. Validações
    if (cleanCPF.length !== 11) {
      alert("O CPF deve conter exatamente 11 dígitos.");
      return;
    }

    if (!isValidCPF(cleanCPF)) {
      alert("O CPF informado é inválido.");
      return;
    }

    if (cleanBirth.length !== 8) {
      alert("A data de nascimento deve conter 8 dígitos (DD/MM/AAAA).");
      return;
    }

    if (!userForm.senha || userForm.senha.length < 6) {
      alert("A senha deve conter ao menos 6 caracteres.");
      return;
    }

    // 2. Payload pronto para a API (com hífen e sem confirmarSenha)
    const payload = {
      nome: userForm.nome.trim(),
      cpf: cleanCPF,
      dataNascimento: userForm.dataNascimento, // Result: "2003-08-04"
      role: userForm.role || "standard",
      senha: userForm.senha,
    };

    console.log("Submitting Clean Admin Payload:", payload);

    createUserMutation.mutate(payload);
  };

  const handleSaveModalEdit = (updated: Address) => {
    const { id, userId: _uid, createdAt: _created, ...dto } = updated;
    updateAddressMutation.mutate({ id, dto });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configurações e Cadastros</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gerenciamento direto dos registros em <code>/users</code> e <code>/enderecos</code>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActivePanel("manage-addresses")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activePanel === "manage-addresses"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          Editar / Remover Endereços ({addresses.length})
        </button>

        <button
          type="button"
          onClick={() => setActivePanel("add-address")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activePanel === "add-address"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          + Adicionar Endereço
        </button>

        <button
          type="button"
          onClick={() => setActivePanel("add-user")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activePanel === "add-user"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          + Adicionar Usuário
        </button>
      </div>

      {/* PANEL 1: LIST & MANAGE ADDRESSES */}
      {activePanel === "manage-addresses" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Listagem de Endereços</h3>

          {loadingAddresses ? (
            <div className="py-8 text-center text-xs text-slate-400">Carregando...</div>
          ) : addresses.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Nenhum endereço encontrado em /enderecos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5">CEP</th>
                    <th className="py-2.5">Logradouro</th>
                    <th className="py-2.5">Nº</th>
                    <th className="py-2.5">Cidade/UF</th>
                    <th className="py-2.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {addresses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-medium text-slate-900">{maskCEP(a.cep)}</td>
                      <td className="py-3">{a.logradouro}</td>
                      <td className="py-3">{a.numero}</td>
                      <td className="py-3">
                        {a.cidade}/{a.estado}
                      </td>
                      <td className="py-3 text-right space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingAddress(a)}
                          className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Deseja realmente remover este endereço?")) {
                              deleteAddressMutation.mutate(a.id);
                            }
                          }}
                          className="font-semibold text-rose-600 hover:text-rose-800"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: ADD ADDRESS FORM */}
      {activePanel === "add-address" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Adicionar Endereço (POST /enderecos)</h3>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Selecione o Usuário
              </label>
              {loadingUsers ? (
                <div className="text-xs text-slate-400">Carregando usuários...</div>
              ) : (
                <select
                  value={addressForm.userId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddressForm((prev) => ({
                      ...prev,
                      userId: val === "" ? "" : Number(val),
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                  required
                >
                  <option value="">Selecione um usuário...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({maskCPF(u.cpf)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CEP"
                placeholder="00000-000"
                value={addressForm.cep}
                onChange={(e) => setAddressForm({ ...addressForm, cep: maskCEP(e.target.value) })}
                required
              />
              <Input
                label="Número"
                type="text"
                placeholder="Ex: 123 ou S/N"
                value={addressForm.numero}
                onChange={(e) => setAddressForm({ ...addressForm, numero: e.target.value })}
                required
              />
            </div>

            <Input
              label="Logradouro"
              placeholder="Rua, Avenida, etc."
              value={addressForm.logradouro}
              onChange={(e) => setAddressForm({ ...addressForm, logradouro: e.target.value })}
              required
            />

            <Input
              label="Complemento"
              placeholder="Apto, Bloco, etc. (opcional)"
              value={addressForm.complemento || ""}
              onChange={(e) => setAddressForm({ ...addressForm, complemento: e.target.value })}
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Bairro"
                value={addressForm.bairro}
                onChange={(e) => setAddressForm({ ...addressForm, bairro: e.target.value })}
                required
              />
              <Input
                label="Cidade"
                value={addressForm.cidade}
                onChange={(e) => setAddressForm({ ...addressForm, cidade: e.target.value })}
                required
              />
              <Input
                label="UF"
                maxLength={2}
                value={addressForm.estado}
                onChange={(e) => setAddressForm({ ...addressForm, estado: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="addr-main-checkbox"
                checked={Boolean(addressForm.isMain)}
                onChange={(e) => setAddressForm({ ...addressForm, isMain: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="addr-main-checkbox" className="text-xs font-medium text-slate-700">
                Definir como endereço principal deste usuário
              </label>
            </div>

            <button
              type="submit"
              disabled={createAddressMutation.isPending}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {createAddressMutation.isPending ? "Salvando..." : "Salvar Endereço"}
            </button>
          </form>
        </div>
      )}

      {/* PANEL 3: ADD USER FORM */}
      {activePanel === "add-user" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Cadastrar Novo Usuário (POST /users)</h3>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              value={userForm.nome}
              onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                value={userForm.cpf}
                onChange={(e) => setUserForm({ ...userForm, cpf: maskCPF(e.target.value) })}
                required
              />
              <Input
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                value={userForm.dataNascimento}
                onChange={(e) =>
                  setUserForm({ ...userForm, dataNascimento: maskDate(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Perfil de Acesso</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
              >
                <option value="standard">Standard (Usuário Comum)</option>
                <option value="admin">Admin (Administrador)</option>
              </select>
            </div>

            <Input
              label="Senha Inicial"
              type="password"
              placeholder="••••••••"
              value={userForm.senha}
              onChange={(e) => setUserForm({ ...userForm, senha: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {createUserMutation.isPending ? "Cadastrando..." : "Cadastrar Usuário"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      <EditAddressModal
        isOpen={Boolean(editingAddress)}
        address={editingAddress}
        onClose={() => setEditingAddress(null)}
        onSave={handleSaveModalEdit}
      />
    </div>
  );
};