import ThemeToggle from './ThemeToggle';

// Encabezado de la página con el interruptor de tema.
function PageHeader({ darkMode, onToggleTheme }) {
  return (
    <header className="app__header">
      <div>
        <p className="app__eyebrow">
          <span>Top Club</span> / <span className="app__eyebrow-accent">Basketball</span>
        </p>
        <h1 className="app__title">Central de Rendimiento</h1>
        <p className="app__subtitle">
          Administra convocatorias, analiza métricas clave y mantén la intensidad de juego en cada
          partido.
        </p>
      </div>
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
    </header>
  );
}

export default PageHeader;
