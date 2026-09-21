import React from "react";
import type { Address } from "../../../types/address";
import { maskCEP } from "../../../utils/masks";

export interface AddressCardProps {
  address: Address;
  onSetMain?: (id: number) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (id: number) => void;
  isFeatured?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSetMain,
  onEdit,
  onDelete,
  isFeatured = false,
}) => {
  return (
    <div
      className={`p-5 flex flex-col justify-between transition-all ${
        isFeatured
          ? "bg-indigo-50/60 border-2 border-indigo-500 rounded-2xl shadow-sm"
          : "bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300"
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            CEP {maskCEP(address.cep || "")}
          </span>

          {address.isMain && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Principal
            </span>
          )}
        </div>

        {/* Street & Number */}
        <h4 className="text-base font-bold text-slate-900 leading-snug">
          {address.logradouro}, {address.numero}
        </h4>

        {address.complemento && (
          <p className="text-xs text-slate-500 mt-0.5">
            Compl: <span className="text-slate-700 font-medium">{address.complemento}</span>
          </p>
        )}

        {/* Region Details */}
        <div className="text-xs text-slate-600 mt-3 space-y-0.5">
          <p>
            <span className="text-slate-400">Bairro:</span> {address.bairro}
          </p>
          <p>
            <span className="text-slate-400">Cidade/UF:</span> {address.cidade} - {address.estado}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {!address.isMain && onSetMain && (
            <button
              type="button"
              onClick={() => onSetMain(address.id)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Tornar Principal
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(address)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Editar
            </button>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="text-xs font-medium text-rose-600 hover:text-rose-800 hover:underline transition-colors"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
};