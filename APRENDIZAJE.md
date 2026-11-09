# 📚 APRENDIZAJE

> **IA utilizada:** Claude (Anthropic, Claude Sonnet 5.5). Los ejemplos de código son del proyecto (`src/App.jsx` y `src/components`).

## a) ¿Qué es `useState` y cuándo usarlo?

`useState` es el hook que le da **memoria** a un componente funcional. Devuelve `[valor, setter]`; al llamar el setter React vuelve a renderizar el componente con el nuevo valor. Se usa para datos que **cambian con el tiempo y afectan lo que se ve** (inputs, páginas, toggles, listas). Si un dato se puede calcular a partir de otro estado, no necesita su propio `useState` (se deriva, ver `useMemo`). Nunca se muta el estado directamente: se crea una copia nueva.

**Ejemplo 1 – texto de búsqueda (input controlado):**
```jsx
const [searchTerm, setSearchTerm] = useState('');
<input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
```

**Ejemplo 2 – ordenamiento con objeto y actualización funcional:**
```jsx
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

setSortConfig((prev) => {
  const current = prev.key === key ? prev.direction : 'none';
  const direction = NEXT_DIRECTION[current]; // none → asc → desc → none
  return { key: direction === 'none' ? null : key, direction };
});
```

**Ejemplo 3 – favoritos (arreglo, sin `push`):**
```jsx
const [favorites, setFavorites] = useState([]);

const handleToggleFavorite = (id) =>
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
  );
```

## b) ¿Qué es `useEffect` y sus casos de uso?

`useEffect` ejecuta **efectos secundarios** (cosas fuera del renderizado): timers, `localStorage`, listeners, peticiones. Ciclo de vida: el componente se **monta** (primer render) → se **actualiza** (cada cambio de estado/props) → se **desmonta**. `useEffect` corre *después* de pintar y puede devolver una función de **cleanup** que se ejecuta antes del siguiente efecto y al desmontar.

| Array de dependencias | Cuándo se ejecuta |
|---|---|
| `[]` | Solo una vez, al montar (carga inicial) |
| `[dep]` | Al montar y cada vez que `dep` cambia |
| _sin array_ | Después de **cada** render (casi nunca conviene) |

```jsx
// [dep]: reinicia la paginación cuando cambian los filtros
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, showOnlyFavorites, itemsPerPage]);

// [dep] con listener + cleanup: cerrar el modal con Escape
useEffect(() => {
  if (!isOpen) return undefined;
  const onKey = (e) => e.key === 'Escape' && onClose();
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey); // CLEANUP
}, [isOpen, onClose]);
```

En el proyecto la carga inicial desde `localStorage` se hace con un *lazy initializer* de `useState` (`useState(() => readStorage('darkMode', true))`), equivalente a un efecto con `[]` pero sin un render extra.

## c) ¿Qué es `useMemo` y cuándo usarlo?

`useMemo(fn, deps)` **guarda el resultado de un cálculo** y solo lo recalcula si cambian las dependencias. Sirve para cálculos costosos (filtrar, ordenar, agregar listas grandes) y para mantener estable la referencia de objetos/arreglos que se pasan a hijos.

**Diferencia con `useCallback`:** `useMemo` memoriza un **valor** (el resultado de ejecutar la función); `useCallback` memoriza **la función misma** (`useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`). Se usa `useCallback` para pasar callbacks estables a componentes hijos.

**Ejemplo del proyecto – estadísticas en tiempo real:**
```jsx
const stats = useMemo(
  () => ({
    total: filteredPlayers.length,
    avgPoints: average(filteredPlayers, 'points'),
    avgRebounds: average(filteredPlayers, 'rebounds'),
    topScorer: findTop(filteredPlayers, 'points'),
    topEfficiency: findTop(filteredPlayers, 'efficiency'),
    distribution: countByPosition(filteredPlayers)
  }),
  [filteredPlayers]
);
```
Si el usuario solo abre el modal, pinta filas o cambia de página, `filteredPlayers` no cambia y las estadísticas **no se recalculan**. Se encadena con `filteredPlayers → sortedPlayers → pagePlayers`.

## d) ¿Cómo funciona el cleanup en `useEffect`?

La función que devuelve el efecto se ejecuta **antes de volver a correr el efecto** (cuando cambia una dependencia) y **al desmontar** el componente. Sirve para cancelar lo que el efecto dejó pendiente: timers, listeners, suscripciones. Sin cleanup habría fugas de memoria y comportamientos duplicados.

**Debounce del proyecto:**
```jsx
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
  return () => clearTimeout(timer); // CLEANUP
}, [searchTerm]);
```
Si escribes "k", "ke", "kev" rápido: cada tecla cambia `searchTerm`, React ejecuta el cleanup (cancela el timer anterior) y crea uno nuevo. Solo cuando pasan 300 ms **sin escribir** se actualiza `debouncedSearch`, que es el valor que filtra la tabla. Así se evitan filtrados innecesarios en cada pulsación.

## e) ¿Cómo funciona `localStorage` con React?

`localStorage` guarda pares clave/valor **de texto** en el navegador y persiste al recargar. Con React se combina: (1) **leer** al iniciar el estado y (2) **escribir** en un `useEffect` cada vez que el estado cambia. Como solo guarda strings, se usa `JSON.stringify` / `JSON.parse` para arreglos y booleanos. Se envuelve en `try/catch` por si el almacenamiento no está disponible.

```js
// src/utils/storage.js
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin persistencia */ }
}
```
```jsx
// App.jsx – leer al cargar y guardar al cambiar
const [darkMode, setDarkMode] = useState(() => readStorage('darkMode', true));
const [favorites, setFavorites] = useState(() => readStorage('favorites', []));

useEffect(() => {
  writeStorage('darkMode', darkMode);
  document.body.classList.toggle('dark-mode', darkMode);
}, [darkMode]);
useEffect(() => writeStorage('favorites', favorites), [favorites]);
```
Claves usadas: `darkMode`, `favorites` y `searchHistory`.
