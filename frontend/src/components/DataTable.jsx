import { useState, useMemo } from 'react';

/**
 * Generic table with click-to-sort headers (ascending/descending).
 *
 * columns: [{ key, label, sortable=true, render?(row) }]
 * rows: array of objects
 * Sorting is done client-side and handles strings + numbers; null/undefined sink to the bottom.
 */
export default function DataTable({ columns, rows, initialSort }) {
  const [sortKey, setSortKey] = useState(initialSort?.key || null);
  const [sortDir, setSortDir] = useState(initialSort?.dir || 'asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const an = Number(av);
      const bn = Number(bv);
      let cmp;
      if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== '' && bv !== '') {
        cmp = an - bn;
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' });
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const arrow = (key) => {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable === false ? undefined : () => toggleSort(col.key)}
                className={col.sortable === false ? '' : 'sortable'}
              >
                {col.label}
                {col.sortable === false ? '' : arrow(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                No records found.
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
