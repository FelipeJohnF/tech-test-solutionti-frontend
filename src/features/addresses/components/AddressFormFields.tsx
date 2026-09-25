import React from "react";
import { Input } from "../../../components/Input";
import { maskCEP } from "../../../utils/masks";

export interface AddressFormValues {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  isMain?: boolean;
}

interface AddressFormFieldsProps {
  values: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
  idPrefix?: string;
  mainCheckboxLabel?: string;
}

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  values,
  onChange,
  idPrefix = "endereco",
  mainCheckboxLabel = "Definir como endereço principal",
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="CEP"
          id={`${idPrefix}-cep`}
          placeholder="00000-000"
          value={values.cep}
          onChange={(e) => onChange({ ...values, cep: maskCEP(e.target.value) })}
          required
        />
        <Input
          label="Número"
          id={`${idPrefix}-numero`}
          type="text"
          placeholder="Ex: 123 ou S/N"
          value={values.numero}
          onChange={(e) => onChange({ ...values, numero: e.target.value })}
          required
        />
      </div>

      <Input
        label="Logradouro"
        id={`${idPrefix}-logradouro`}
        placeholder="Rua, Avenida, etc."
        value={values.logradouro}
        onChange={(e) => onChange({ ...values, logradouro: e.target.value })}
        required
      />

      <Input
        label="Complemento"
        id={`${idPrefix}-complemento`}
        placeholder="Apto, Bloco, etc. (opcional)"
        value={values.complemento || ""}
        onChange={(e) => onChange({ ...values, complemento: e.target.value })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Bairro"
          id={`${idPrefix}-bairro`}
          value={values.bairro}
          onChange={(e) => onChange({ ...values, bairro: e.target.value })}
          required
        />
        <Input
          label="Cidade"
          id={`${idPrefix}-cidade`}
          value={values.cidade}
          onChange={(e) => onChange({ ...values, cidade: e.target.value })}
          required
        />
        <Input
          label="UF"
          id={`${idPrefix}-estado`}
          maxLength={2}
          value={values.estado}
          onChange={(e) => onChange({ ...values, estado: e.target.value.toUpperCase() })}
          required
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={`${idPrefix}-main-checkbox`}
          checked={Boolean(values.isMain)}
          onChange={(e) => onChange({ ...values, isMain: e.target.checked })}
          className="rounded border-slate-300 text-indigo-600"
        />
        <label htmlFor={`${idPrefix}-main-checkbox`} className="text-xs font-medium text-slate-700">
          {mainCheckboxLabel}
        </label>
      </div>
    </>
  );
};
