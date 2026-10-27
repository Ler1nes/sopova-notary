/** Форматирование чисел в русской типографике: 12 000, 4,9. */
export function formatStat(value: number, decimals = 0): string {
  if (decimals > 0) return value.toFixed(decimals).replace('.', ',');
  return Math.round(value).toLocaleString('ru-RU');
}
