import '../styles/ThemeToggle.css';

function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={darkMode}
      className={`theme-toggle ${darkMode ? 'theme-toggle--dark' : ''}`}
      onClick={onToggle}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">{darkMode ? '🌙' : '☀️'}</span>
      </span>
      <span className="theme-toggle__text">{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}

export default ThemeToggle;
