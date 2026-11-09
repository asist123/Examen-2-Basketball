const PAINT_OPTIONS = [
  ['pares', 'Filas pares'],
  ['impares', 'Filas impares']
];

// Botones de coloreo de filas y filtro de favoritos.
function Toolbar({
  rowColors,
  onRowColorsChange,
  showOnlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__group">
        {PAINT_OPTIONS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`toolbar__btn ${rowColors === value ? 'toolbar__btn--active' : ''}`}
            onClick={() => onRowColorsChange(value)}
          >
            {label}
          </button>
        ))}
        <button type="button" className="toolbar__btn" onClick={() => onRowColorsChange('none')}>
          Limpiar resaltado
        </button>
      </div>
      <div className="toolbar__group">
        <label className="toolbar__check">
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={(e) => onToggleOnlyFavorites(e.target.checked)}
          />
          Mostrar solo favoritos
        </label>
        <span className="toolbar__favorites">★ {favoritesCount} favoritos guardados</span>
      </div>
    </div>
  );
}

export default Toolbar;
