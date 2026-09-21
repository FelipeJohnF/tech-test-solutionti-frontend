import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../../services/adminService";
import { maskCEP, maskCPF } from "../../../utils/masks";

export const VisualizationView: React.FC = () => {
  const [subTab, setSubTab] = useState<"users" | "addresses">("users");
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading: loadingUsers,
    isError: errorUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: adminService.getAllUsers,
  });

  const {
    data: addresses = [],
    isLoading: loadingAddresses,
    isError: errorAddresses,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["enderecos"],
    queryFn: adminService.getAllAddresses,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.cpf.includes(search.replace(/\D/g, ""))
  );

  const filteredAddresses = addresses.filter(
    (a) =>
      a.logradouro.toLowerCase().includes(search.toLowerCase()) ||
      a.cidade.toLowerCase().includes(search.toLowerCase()) ||
      a.bairro.toLowerCase().includes(search.toLowerCase()) ||
      a.cep.includes(search.replace(/\D/g, ""))
  );

  const isLoading = loadingUsers || loadingAddresses;
  const hasError = errorUsers || errorAddresses;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Visão Geral do Sistema</h2>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe todos os usuários e endereços cadastrados no sistema.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Usuários</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">
            {loadingUsers ? "..." : users.length}
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Endereços</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">
            {loadingAddresses ? "..." : addresses.length}
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Média Endereços / Usuário</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">
            {users.length > 0 ? (addresses.length / users.length).toFixed(1) : "0.0"}
          </p>
        </div>
      </div>

      {/* Table Surface */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setSubTab("users"); setSearch(""); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                subTab === "users"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Usuários ({users.length})
            </button>
            <button
              type="button"
              onClick={() => { setSubTab("addresses"); setSearch(""); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                subTab === "addresses"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Endereços ({addresses.length})
            </button>
          </div>

          <input
            type="text"
            placeholder={
              subTab === "users"
                ? "Buscar por nome ou CPF..."
                : "Buscar por rua, bairro, cidade ou CEP..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs px-3.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 w-full sm:w-72"
          />
        </div>

        {isLoading && (
          <div className="py-12 text-center text-sm text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Carregando listagem...
          </div>
        )}

        {hasError && !isLoading && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
            <span>Erro ao buscar dados de /users ou /enderecos.</span>
            <button
              type="button"
              onClick={() => { refetchUsers(); refetchAddresses(); }}
              className="font-semibold underline hover:text-rose-900"
            >
              Recarregar
            </button>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !hasError && subTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5">Nome</th>
                  <th className="py-2.5">CPF</th>
                  <th className="py-2.5">Nascimento</th>
                  <th className="py-2.5">Perfil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">{u.nome}</td>
                      <td className="py-3 font-mono">{maskCPF(u.cpf)}</td>
                      <td className="py-3">{u.dataNascimento}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Addresses Table */}
        {!isLoading && !hasError && subTab === "addresses" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5">CEP</th>
                  <th className="py-2.5">Logradouro, Nº</th>
                  <th className="py-2.5">Bairro</th>
                  <th className="py-2.5">Cidade/UF</th>
                  <th className="py-2.5">Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAddresses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      Nenhum endereço encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredAddresses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-medium text-slate-900">{maskCEP(a.cep)}</td>
                      <td className="py-3">
                        {a.logradouro}, {a.numero}
                        {a.complemento && (
                          <span className="text-slate-400"> ({a.complemento})</span>
                        )}
                      </td>
                      <td className="py-3">{a.bairro}</td>
                      <td className="py-3">{a.cidade}/{a.estado}</td>
                      <td className="py-3">
                        {a.isMain ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            Sim
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};