const toNumber = (value: number | string) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const formatBRL = (value: number | string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(toNumber(value));

export const formatNumber = (value: number | string) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(toNumber(value));
