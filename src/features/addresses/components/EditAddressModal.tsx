import React, { useState, useEffect } from "react";
import type { Address } from "../../../types/address";
import { Input } from "../../../components/Input";
import { maskCEP } from "../../../utils/masks";

interface EditAddressModalProps {
  isOpen: boolean;
  address: Address | null;
  onClose: () => void;
  onSave: (updated: Address) => void;
}

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
  isOpen,
  address,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Address | null>(null);

  useEffect(() => {
    setFormData(address);
  }, [address]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Editar Endereço</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Altere as informações de entrega abaixo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CEP"
              id="edit-cep"
              value={formData.cep}
              onChange={(e) =>
                setFormData({ ...formData, cep: maskCEP(e.target.value) })
              }
              required
            />
            <Input
              label="Número"
              id="edit-numero"
              type="text"
              placeholder="Ex: 123 ou S/N"
              value={formData.numero}
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Logradouro"
            id="edit-logradouro"
            value={formData.logradouro}
            onChange={(e) =>
              setFormData({ ...formData, logradouro: e.target.value })
            }
            required
          />

          <Input
            label="Complemento"
            id="edit-complemento"
            placeholder="Apto, Bloco, Casa (opcional)"
            value={formData.complemento || ""}
            onChange={(e) =>
              setFormData({ ...formData, complemento: e.target.value })
            }
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Input
                label="Bairro"
                id="edit-bairro"
                value={formData.bairro}
                onChange={(e) =>
                  setFormData({ ...formData, bairro: e.target.value })
                }
                required
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Cidade"
                id="edit-cidade"
                value={formData.cidade}
                onChange={(e) =>
                  setFormData({ ...formData, cidade: e.target.value })
                }
                required
              />
            </div>
            <div className="col-span-1">
              <Input
                label="UF"
                id="edit-estado"
                maxLength={2}
                value={formData.estado}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estado: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};