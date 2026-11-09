export const formatNumber = (n) => String(n).padStart(2, '0');

export const average = (list, key) =>
  list.length === 0 ? 0 : list.reduce((sum, p) => sum + p[key], 0) / list.length;

export const findTop = (list, key) =>
  list.length === 0 ? null : list.reduce((max, p) => (p[key] > max[key] ? p : max));

export function countByPosition(list) {
  const counts = list.reduce((acc, p) => {
    acc[p.position] = (acc[p.position] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([position, count]) => ({ position, count }))
    .sort((a, b) => b.count - a.count || a.position.localeCompare(b.position));
}

// Ordena sin mutar el arreglo original. direction: 'asc' | 'desc' | 'none'
export function sortPlayers(list, { key, direction }) {
  if (!key || direction === 'none') return list;
  const factor = direction === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    const result =
      typeof x === 'string' ? x.localeCompare(y, 'es') : x - y;
    return result * factor;
  });
}

// Normaliza para buscar sin importar mayúsculas ni tildes.
export const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// Páginas visibles con elipsis: [1, '…', 4, 5, 6, '…', 12]
export function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('…');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < total - 1) items.push('…');
  items.push(total);
  return items;
}
