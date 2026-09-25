import React, { useState } from "react";
import { AddressFormFields, type AddressFormValues } from "./AddressFormFields";
import type { CreateAddressDTO } from "../../../types/address";
import { stripMask } from "../../../utils/masks";

interface CreateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: Omit<CreateAddressDTO, "userId">) => Promise<void> | void;
  loading?: boolean;
}

const emptyForm: AddressFormValues = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  isMain: false,
};

export const CreateAddressModal: React.FC<CreateAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<AddressFormValues>(emptyForm);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (stripMask(formData.cep).length !== 8) {
      setError("O CEP deve conter exatamente 8 dígitos.");
      return;
    }
    if (formData.estado.length !== 2) {
      setError("O Estado deve ser a sigla com 2 letras (ex: SP).");
      return;
    }

    const payload: Omit<CreateAddressDTO, "userId"> = {
      ...formData,
      cep: stripMask(formData.cep),
      estado: formData.estado.toUpperCase(),
    };

    await onSave(payload);
    setFormData(emptyForm); // reset for next time the modal opens
  };

  const handleClose = () => {
    setFormData(emptyForm);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white border border-slate-200 shadow-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Novo Endereço</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <AddressFormFields
            values={formData}
            onChange={setFormData}
            idPrefix="create-endereco"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Adicionar Endereço"}
          </button>
        </form>
      </div>
    </div>
  );
};
