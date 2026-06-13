import { TrendingUp } from 'lucide-react'

const VARIANT_MAP = {
  total:   { color: 'var(--text)',    bg: 'var(--bg3)',         border: 'var(--border2)' },
  blocked: { color: 'var(--blocked)', bg: 'var(--blocked-bg)',  border: 'var(--blocked-border)' },
  warning: { color: 'var(--warning)', bg: 'var(--warning-bg)',  border: 'var(--warning-border)' },
  safe:    { color: 'var(--safe)',    bg: 'var(--safe-bg)',      border: 'var(--safe-border)' },
}

export default function StatsCard({ title, value, variant = 'total', icon: Icon }) {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.total

  return (
    <div style={{ ...styles.card, borderColor: v.border }}>
      <div style={styles.top}>
        <span style={styles.label}>{title}</span>
        {Icon && (
          <div style={{ ...styles.iconWrap, background: v.bg, borderColor: v.border }}>
            <Icon size={13} color={v.color} />
          </div>
        )}
      </div>
      <div style={{ ...styles.value, color: v.color }}>{value.toLocaleString()}</div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg2)',
    border: '1px solid',
    borderRadius: '10px',
    padding: '20px',
    animation: 'fadeIn 0.3s ease',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  iconWrap: {
    width: '26px',
    height: '26px',
    border: '1px solid',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: '34px',
    fontWeight: '800',
    lineHeight: 1,
  },
}
