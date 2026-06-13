import { useState } from 'react'
import { Search, X } from 'lucide-react'
import AlertRow from './AlertRow'

const PAGE_SIZE = 15
const FILTERS = ['ALL', 'BLOCKED', 'WARNING', 'SAFE']

const FILTER_COLORS = {
  ALL: 'var(--text)',
  BLOCKED: 'var(--blocked)',
  WARNING: 'var(--warning)',
  SAFE: 'var(--safe)',
}

export default function AlertFeed({ alerts }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = alerts.filter((a) => {
    if (filter !== 'ALL' && a.verdict !== filter) return false
    const q = search.toLowerCase()
    return !q || (a.text || '').toLowerCase().includes(q) || (a.mask || '').toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFilter(f) {
    setFilter(f)
    setCurrentPage(1)
  }

  function handleSearch(val) {
    setSearch(val)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Filter tabs */}
        <div style={styles.filterGroup}>
          {FILTERS.map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? { ...styles.filterBtnActive, color: FILTER_COLORS[f] } : {}),
              }}
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <Search size={13} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search alerts…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => handleSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Count */}
        <span style={styles.count}>
          {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Alert list */}
      <div style={styles.list}>
        {visible.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyTitle}>No alerts found</div>
            <div style={styles.emptyText}>
              {search ? `No results for "${search}"` : 'No alerts in this category yet.'}
            </div>
          </div>
        ) : (
          visible.map((a, i) => <AlertRow key={a.id || i} alert={a} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push('…')
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '…' ? (
                <span key={`sep-${i}`} style={styles.pageSep}>…</span>
              ) : (
                <button
                  key={p}
                  style={{ ...styles.pageBtn, ...(p === currentPage ? styles.pageBtnActive : {}) }}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}

          <button
            style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.3 : 1 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    gap: '2px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '3px',
  },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: '5px',
    border: 'none',
    background: 'transparent',
    color: 'var(--muted)',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    cursor: 'pointer',
    letterSpacing: '0.08em',
    transition: 'all 0.15s',
  },
  filterBtnActive: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    minWidth: '180px',
  },
  searchInput: {
    width: '100%',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px 36px',
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--muted)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
  },
  count: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    flexShrink: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empty: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '48px 24px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    color: 'var(--text)',
    marginBottom: '6px',
  },
  emptyText: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    padding: '24px 0',
  },
  pageBtn: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    color: 'var(--text)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minWidth: '34px',
  },
  pageBtnActive: {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: '#000',
  },
  pageSep: {
    color: 'var(--muted)',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    padding: '0 4px',
  },
}
