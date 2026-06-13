import { Shield, RefreshCw, LogOut } from 'lucide-react'

export default function Header({ syncTime, onRefresh, onLogout, loading }) {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.shieldWrap}>
            <Shield size={16} color="var(--accent)" />
          </div>
          <span style={styles.brandText}>
            Shadow<span style={{ color: 'var(--accent)' }}>Guard</span>
          </span>
          <span style={styles.consoleBadge}>ADMIN</span>
        </div>

        {/* Right controls */}
        <div style={styles.controls}>
          <div style={styles.liveRow}>
            <span style={styles.liveDot} />
            <span style={styles.liveLabel}>LIVE</span>
          </div>
          <span style={styles.syncText}>{syncTime !== '–' ? `Synced ${syncTime}` : 'Awaiting sync…'}</span>
          <button style={styles.btn} onClick={onRefresh} title="Refresh now">
            <RefreshCw size={12} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={onLogout} title="Sign out">
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'rgba(8,11,15,0.92)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  shieldWrap: {
    width: '32px',
    height: '32px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '800',
    fontFamily: 'var(--sans)',
  },
  consoleBadge: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '4px',
    padding: '2px 7px',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--muted)',
    letterSpacing: '0.1em',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  liveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--safe)',
    animation: 'pulse 2s ease-in-out infinite',
    display: 'inline-block',
  },
  liveLabel: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--safe)',
    letterSpacing: '0.1em',
  },
  syncText: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    color: 'var(--text)',
    padding: '7px 12px',
    borderRadius: '6px',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
  btnDanger: {
    // hover handled inline in JSX would need state; using CSS class is fine
    // For simplicity we leave it as-is — the CSS in index.css handles .btn.danger
  },
}
