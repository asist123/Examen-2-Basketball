import { useEffect, useMemo, useState } from 'react';
import players from './data/players';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import StatsPanel from './components/StatsPanel';
import PlayerTable from './components/PlayerTable';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import PageHeader from './components/PageHeader';
import Scoreboard from './components/Scoreboard';
import Toolbar from './components/Toolbar';
import { readStorage, writeStorage } from './utils/storage';
import { average, countByPosition, findTop, normalize, sortPlayers } from './utils/playerUtils';
import './styles/App.css';

const DEBOUNCE_MS = 300;
const HISTORY_LIMIT = 5;
const NEXT_DIRECTION = { none: 'asc', asc: 'desc', desc: 'none' };

function App() {
  // --- Búsqueda con debounce ---
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => readStorage('searchHistory', []));

  // --- Tabla: coloreo, paginación, ordenamiento ---
  const [rowColors, setRowColors] = useState('none'); // 'none' | 'pares' | 'impares'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  // --- Tema, favoritos y modal ---
  const [darkMode, setDarkMode] = useState(() => readStorage('darkMode', true));
  const [favorites, setFavorites] = useState(() => readStorage('favorites', []));
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce de 300 ms: el cleanup cancela el timer si el usuario sigue escribiendo.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Historial: guarda las últimas 5 búsquedas (sin duplicados).
  useEffect(() => {
    const term = debouncedSearch.trim();
    if (term.length > 0) {
      setSearchHistory((prev) => [term, ...prev.filter((s) => s !== term)].slice(0, HISTORY_LIMIT));
    }
  }, [debouncedSearch]);

  // Persistencia en localStorage.
  useEffect(() => writeStorage('searchHistory', searchHistory), [searchHistory]);
  useEffect(() => writeStorage('favorites', favorites), [favorites]);
  useEffect(() => {
    writeStorage('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Al cambiar los filtros la paginación vuelve a la página 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showOnlyFavorites, itemsPerPage]);

  // Filtrado: búsqueda por nombre, equipo o posición (sin tildes/mayúsculas) + solo favoritos.
  const filteredPlayers = useMemo(() => {
    const query = normalize(debouncedSearch);
    return players.filter(
      (p) =>
        normalize(`${p.name} ${p.team} ${p.position}`).includes(query) &&
        (!showOnlyFavorites || favorites.includes(p.id))
    );
  }, [debouncedSearch, showOnlyFavorites, favorites]);

  const sortedPlayers = useMemo(
    () => sortPlayers(filteredPlayers, sortConfig),
    [filteredPlayers, sortConfig]
  );

  // Estadísticas: se recalculan solo cuando cambia la lista filtrada.
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

  const totalPages = Math.max(1, Math.ceil(sortedPlayers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagePlayers = useMemo(
    () => sortedPlayers.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage),
    [sortedPlayers, safePage, itemsPerPage]
  );

  const handleSort = (key) => {
    // Ciclo: sin ordenar → ascendente → descendente → sin ordenar
    setSortConfig((prev) => {
      const current = prev.key === key ? prev.direction : 'none';
      const direction = NEXT_DIRECTION[current];
      return { key: direction === 'none' ? null : key, direction };
    });
  };

  const handleToggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const handleRowClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  return (
    <div className={`app ${darkMode ? 'app--dark' : 'app--light'}`}>
      <main className="app__container">
        <PageHeader darkMode={darkMode} onToggleTheme={() => setDarkMode((d) => !d)} />

        <Scoreboard />

        <section className="dashboard">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClearSearch}
            resultsCount={filteredPlayers.length}
          />

          <StatsPanel stats={stats} darkMode={darkMode} favoritesCount={favorites.length}>
            <SearchHistory
              history={searchHistory}
              onSelectSearch={setSearchTerm}
              onClearHistory={() => setSearchHistory([])}
            />
          </StatsPanel>

          <Toolbar
            rowColors={rowColors}
            onRowColorsChange={setRowColors}
            showOnlyFavorites={showOnlyFavorites}
            onToggleOnlyFavorites={setShowOnlyFavorites}
            favoritesCount={favorites.length}
          />

          <PlayerTable
            players={pagePlayers}
            onRowClick={handleRowClick}
            onSort={handleSort}
            sortConfig={sortConfig}
            darkMode={darkMode}
            rowColors={rowColors}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={sortedPlayers.length}
          />
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        player={selectedPlayer}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;
