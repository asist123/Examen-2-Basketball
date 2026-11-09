import '../styles/SearchHistory.css';

// Tarjeta con las últimas búsquedas (chips). Al hacer clic en una se restaura en el input.
function SearchHistory({ history, onSelectSearch, onClearHistory }) {
  return (
    <div className="search-history stats-panel__card">
      <div className="search-history__head">
        <span className="search-history__title">Historial de búsqueda</span>
        <button
          type="button"
          className="search-history__clear"
          onClick={onClearHistory}
          disabled={history.length === 0}
        >
          Limpiar
        </button>
      </div>
      {history.length === 0 ? (
        <p className="search-history__empty">Aún no hay búsquedas.</p>
      ) : (
        <ul className="search-history__list">
          {history.map((term) => (
            <li key={term}>
              <button
                type="button"
                className="search-history__chip"
                onClick={() => onSelectSearch(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchHistory;
