import PlayerRow from './PlayerRow';
import '../styles/PlayerTable.css';

const COLUMNS = [
  { key: 'number', label: '#', align: 'center' },
  { key: 'name', label: 'Jugador' },
  { key: 'team', label: 'Equipo' },
  { key: 'position', label: 'Posición' },
  { key: 'points', label: 'PTS', align: 'num' },
  { key: 'rebounds', label: 'REB', align: 'num' },
  { key: 'assists', label: 'AST', align: 'num' },
  { key: 'efficiency', label: 'Eficiencia', align: 'num' }
];

const ARROWS = { asc: '↑', desc: '↓', none: '' };
const ARIA_SORT = { asc: 'ascending', desc: 'descending', none: 'none' };

function getColorClass(rowColors, index) {
  const isEven = (index + 1) % 2 === 0;
  if (rowColors === 'pares' && isEven) return 'player-row--painted-even';
  if (rowColors === 'impares' && !isEven) return 'player-row--painted-odd';
  return '';
}

function PlayerTable({
  players,
  onRowClick,
  onSort,
  sortConfig,
  darkMode,
  rowColors,
  favorites,
  onToggleFavorite
}) {
  return (
    <div className={`player-table ${darkMode ? 'player-table--dark' : ''}`}>
      <div className="player-table__scroll">
        <table className="player-table__table">
          <thead>
            <tr>
              <th className="player-table__th player-table__th--fav" scope="col">Fav</th>
              {COLUMNS.map(({ key, label, align }) => {
                const direction = sortConfig.key === key ? sortConfig.direction : 'none';
                return (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={ARIA_SORT[direction]}
                    className={`player-table__th player-table__th--sortable ${
                      align ? `player-table__th--${align}` : ''
                    }`}
                    onClick={() => onSort(key)}
                  >
                    <button type="button" className="player-table__sort">
                      {label}
                      <span
                        className={`player-table__arrow ${
                          direction !== 'none' ? 'player-table__arrow--active' : ''
                        }`}
                        aria-hidden="true"
                      >
                        {ARROWS[direction]}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td className="player-table__empty" colSpan={COLUMNS.length + 1}>
                  No se encontraron jugadores con los filtros actuales.
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  onClick={onRowClick}
                  isFavorite={favorites.includes(player.id)}
                  onToggleFavorite={onToggleFavorite}
                  darkMode={darkMode}
                  colorClass={getColorClass(rowColors, index)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerTable;
