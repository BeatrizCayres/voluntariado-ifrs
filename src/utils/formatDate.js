/**
 * Formata a data de um evento (DATE do MySQL) no padrão brasileiro.
 * @param {string} value - Data em formato ISO (ex.: "2026-10-15T03:00:00.000Z")
 * @returns {string} Data no formato dd/mm/aaaa
 */
export function formatDate(value) {
  const [year, month, day] = value.slice(0, 10).split('-');

  return `${day}/${month}/${year}`;
}
