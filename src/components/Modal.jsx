import { useEffect, useState } from 'react';
import { formatNumber } from '../utils/playerUtils';
import '../styles/Modal.css';

const EXIT_MS = 250; // debe coincidir con la duración de la animación fade-out en CSS

// Modal reutilizable: overlay, cierre con X / click fuera / Escape y fade-in/out.
function Modal({ isOpen, onClose, player, darkMode }) {
  const [visible, setVisible] = useState(isOpen);

  // Mantiene el modal montado durante la animación de salida.
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      return undefined;
    }
    const timer = setTimeout(() => setVisible(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cierra con la tecla Escape mientras está abierto.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!visible || !player) return null;

  const stats = [
    ['Puntos', player.points],
    ['Rebotes', player.rebounds],
    ['Asistencias', player.assists],
    ['Eficiencia', player.efficiency]
  ];

  return (
    <div
      className={`modal ${isOpen ? 'modal--open' : 'modal--closing'} ${darkMode ? 'modal--dark' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${player.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <header className="modal__header">
          <span className="modal__number">#{formatNumber(player.number)}</span>
          <div>
            <h2 className="modal__name">{player.name}</h2>
            <p className="modal__meta">{player.team} · {player.position}</p>
          </div>
        </header>

        <dl className="modal__stats">
          {stats.map(([label, value]) => (
            <div key={label} className="modal__stat">
              <dt className="modal__stat-label">{label}</dt>
              <dd className="modal__stat-value">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className="modal__details">
          <li><span>Edad</span><strong>{player.age} años</strong></li>
          <li><span>Estatura</span><strong>{player.height}</strong></li>
          <li><span>Posición</span><strong>{player.position}</strong></li>
        </ul>
      </div>
    </div>
  );
}

export default Modal;
