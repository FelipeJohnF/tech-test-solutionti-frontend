export const stripMask = (val?: string | number | null): string => {
  if (val === null || val === undefined) return "";
  return String(val).replace(/\D/g, "");
};

export const maskCEP = (val?: string | number | null): string => {
  if (val === null || val === undefined) return "";

  // Convert numbers or whatever type to a string and strip non-digits
  const clean = stripMask(val).slice(0, 8);

  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)}-${clean.slice(5)}`;
};

export const maskCPF = (val?: string | number | null): string => {
  if (val === null || val === undefined) return "";
  const clean = stripMask(val).slice(0, 11);
  return clean
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskDate = (val?: string | number | null): string => {
  if (val === null || val === undefined) return "";
  const clean = String(val).replace(/\D/g, "").slice(0, 8);
  return clean
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

export const formatToYYYYMMDD = (val?: string | number | null): string => {
  if (!val) return "";
    const digits = String(val).replace(/\D/g, "");

    if (digits.length === 8) {
      // If entered in DD/MM/YYYY order (typical in Brazil)
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      return `${year}-${month}-${day}`;
    }

    return String(val);
}
