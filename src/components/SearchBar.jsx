import '../styles/SearchBar.css';

// Barra de búsqueda controlada. El debounce vive en App (useEffect + cleanup).
function SearchBar({ value, onChange, onClear, resultsCount, children }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="player-search">
        Buscar jugadores
      </label>
      <div className="search-bar__row">
        <div className="search-bar__field">
          <span className="search-bar__icon" aria-hidden="true">🔍</span>
          <input
            id="player-search"
            className="search-bar__input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe un nombre o equipo..."
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={onClear}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        {value && (
          <button type="button" className="search-bar__reset" onClick={onClear}>
            Limpiar
          </button>
        )}
        {children}
      </div>
      <p className="search-bar__count" aria-live="polite">
        Mostrando {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
      </p>
    </div>
  );
}

export default SearchBar;
