import React from 'react';
import { IconDatabase } from '@tabler/icons-react';

export default function PaginatedTable({
  columns,
  data,
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  loading,
  emptyMessage = 'No records found',
  renderRow,
  title,
  headerRight,
}) {
  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="admin-table-wrapper">
      {(title || headerRight) && (
        <div className="admin-table-header">
          {title && <div className="admin-table-title">{title}</div>}
          {headerRight}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={columns.length} />
      ) : data.length === 0 ? (
        <div className="admin-empty">
          <IconDatabase size={48} />
          <div className="admin-empty-title">{emptyMessage}</div>
          <div className="admin-empty-text">
            Try adjusting your search or filters.
          </div>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} style={col.width ? { width: col.width } : {}}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => renderRow(row, i))}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {start}–{end} of {totalElements}
              </div>
              <div className="admin-pagination-buttons">
                <button
                  className="admin-pagination-btn"
                  disabled={page <= 0}
                  onClick={() => onPageChange(page - 1)}
                >
                  Prev
                </button>
                <button
                  className="admin-pagination-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => onPageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableSkeleton({ columns }) {
  return (
    <>
      {/* Header skeleton */}
      <div
        style={{
          display: 'flex',
          padding: '12px 20px',
          gap: '20px',
          background: '#F8F9FC',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="admin-skeleton admin-skeleton-line"
            style={{ width: `${80 + (i % 2) * 40}px`, height: '12px' }}
          />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="admin-skeleton-row">
          <div className="admin-skeleton admin-skeleton-circle" />
          {Array.from({ length: columns - 1 }).map((_, j) => (
            <div
              key={j}
              className="admin-skeleton admin-skeleton-line"
              style={{
                width: `${100 + ((i + j) % 3) * 30}px`,
                flex: j === 0 ? '1' : 'none',
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
}
