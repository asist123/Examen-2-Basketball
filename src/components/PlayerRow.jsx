import { formatNumber } from '../utils/playerUtils';

function PlayerRow({ player, index, onClick, isFavorite, onToggleFavorite, darkMode, colorClass }) {
  const classes = [
    'player-row',
    darkMode ? 'player-row--dark' : '',
    colorClass
  ]
    .filter(Boolean)
    .join(' ');

  const handleFavorite = (event) => {
    event.stopPropagation(); // evita abrir el modal al marcar favorito
    onToggleFavorite(player.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(player);
    }
  };

  return (
    <tr
      className={classes}
      onClick={() => onClick(player)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-index={index}
    >
      <td className="player-row__cell player-row__cell--fav">
        <button
          type="button"
          className={`player-row__star ${isFavorite ? 'player-row__star--active' : ''}`}
          onClick={handleFavorite}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? `Quitar a ${player.name} de favoritos` : `Marcar a ${player.name} como favorito`
          }
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
      <td className="player-row__cell player-row__cell--center">{formatNumber(player.number)}</td>
      <td className="player-row__cell player-row__cell--name">{player.name}</td>
      <td className="player-row__cell">{player.team}</td>
      <td className="player-row__cell">{player.position}</td>
      <td className="player-row__cell player-row__cell--num">{player.points}</td>
      <td className="player-row__cell player-row__cell--num">{player.rebounds}</td>
      <td className="player-row__cell player-row__cell--num">{player.assists}</td>
      <td className="player-row__cell player-row__cell--num">{player.efficiency}</td>
    </tr>
  );
}

export default PlayerRow;
