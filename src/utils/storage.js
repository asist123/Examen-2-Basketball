// Lectura/escritura segura de localStorage (maneja JSON inválido y modo privado).
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si el almacenamiento no está disponible, la app sigue funcionando sin persistencia.
  }
}
