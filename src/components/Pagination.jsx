import { getPageItems } from '../utils/playerUtils';
import '../styles/Pagination.css';

const PAGE_SIZES = [5, 10, 15, 20];

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const atStart = currentPage === 1;
  const atEnd = currentPage === totalPages;

  return (
    <nav className="pagination" aria-label="Paginación">
      <div className="pagination__size">
        <label className="pagination__label" htmlFor="items-per-page">Mostrar</label>
        <select
          id="items-per-page"
          className="pagination__select"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size} por página</option>
          ))}
        </select>
        <span className="pagination__info">
          Mostrando {start}-{end} de {totalItems} registros
        </span>
      </div>

      <div className="pagination__controls">
        <button type="button" className="pagination__btn" onClick={() => onPageChange(1)} disabled={atStart} aria-label="Primera página" title="Primera">
          « Primera
        </button>
        <button type="button" className="pagination__btn" onClick={() => onPageChange(currentPage - 1)} disabled={atStart} aria-label="Página anterior" title="Anterior">
          ‹ Anterior
        </button>

        {getPageItems(currentPage, totalPages).map((item, i) =>
          item === '…' ? (
            <span key={`gap-${i}`} className="pagination__gap">…</span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination__btn pagination__btn--page ${
                item === currentPage ? 'pagination__btn--active' : ''
              }`}
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        <button type="button" className="pagination__btn" onClick={() => onPageChange(currentPage + 1)} disabled={atEnd} aria-label="Página siguiente" title="Siguiente">
          Siguiente ›
        </button>
        <button type="button" className="pagination__btn" onClick={() => onPageChange(totalPages)} disabled={atEnd} aria-label="Última página" title="Última">
          Última »
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
