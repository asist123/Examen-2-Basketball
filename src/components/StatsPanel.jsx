import '../styles/StatsPanel.css';

// Panel de estadísticas. Recibe el objeto calculado con useMemo en App.
function StatsPanel({ stats, darkMode, favoritesCount, children }) {
  const { total, avgPoints, avgRebounds, topScorer, topEfficiency, distribution } = stats;
  const maxCount = distribution.reduce((max, d) => Math.max(max, d.count), 0);

  return (
    <section
      className={`stats-panel ${darkMode ? 'stats-panel--dark' : ''}`}
      aria-label="Estadísticas en tiempo real"
    >
      <div className="stats-panel__card stats-panel__card--highlight">
        <span className="stats-panel__label">Jugadores en tabla</span>
        <strong className="stats-panel__value stats-panel__value--big">{total}</strong>
        <span className="stats-panel__chip">Favoritos: {favoritesCount}</span>
      </div>

      <div className="stats-panel__card">
        <span className="stats-panel__label">Promedio de puntos</span>
        <strong className="stats-panel__value">{avgPoints.toFixed(1)}</strong>
      </div>

      <div className="stats-panel__card">
        <span className="stats-panel__label">Promedio de rebotes</span>
        <strong className="stats-panel__value">{avgRebounds.toFixed(1)}</strong>
      </div>

      <div className="stats-panel__card stats-panel__card--leaders">
        <span className="stats-panel__label">Líderes</span>
        {topScorer ? (
          <>
            <span className="stats-panel__leader-title">Anotador</span>
            <span className="stats-panel__leader">
              {topScorer.name} · {topScorer.points} pts
            </span>
            <span className="stats-panel__leader-title">Eficiencia</span>
            <span className="stats-panel__leader">
              {topEfficiency.name} · {topEfficiency.efficiency} PER
            </span>
          </>
        ) : (
          <span className="stats-panel__leader">Sin datos</span>
        )}
      </div>

      {children}

      <div className="stats-panel__card stats-panel__card--chart">
        <span className="stats-panel__label">Distribución por posición</span>
        {distribution.length === 0 ? (
          <span className="stats-panel__leader">Sin datos</span>
        ) : (
          <ul className="stats-panel__bars">
            {distribution.map(({ position, count }) => (
              <li key={position} className="stats-panel__bar-row">
                <span className="stats-panel__bar-name">{position}</span>
                <span className="stats-panel__bar-track">
                  <span
                    className="stats-panel__bar-fill"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </span>
                <span className="stats-panel__bar-count">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default StatsPanel;
