import { useState, useCallback } from 'react'
import { Shield, Scan, Ban, AlertTriangle, CheckCircle } from 'lucide-react'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import ThreatChart from './components/ThreatChart'
import AlertFeed from './components/AlertFeed'
import { useAlerts } from './hooks/useAlerts'

export default function App() {
  const [token, setToken] = useState(null)

  const logout = useCallback(() => {
    setToken(null)
  }, [])

  const { alerts, loading, syncTime, error, fetchData, stats } = useAlerts(token, logout)

  if (!token) {
    return <LoginPage onLogin={setToken} />
  }

  return (
    <div style={styles.root}>
      <Header
        syncTime={syncTime}
        onRefresh={fetchData}
        onLogout={logout}
        loading={loading}
      />

      <div style={styles.wrap}>
        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertTriangle size={13} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats row */}
        <div style={styles.statsGrid}>
          <StatsCard title="Total Scans"  value={stats.total}   variant="total"   icon={Scan} />
          <StatsCard title="Blocked"      value={stats.blocked} variant="blocked" icon={Ban} />
          <StatsCard title="Warnings"     value={stats.warning} variant="warning" icon={AlertTriangle} />
          <StatsCard title="Safe"         value={stats.safe}    variant="safe"    icon={CheckCircle} />
        </div>

        {/* Main layout: chart + feed */}
        <div style={styles.mainGrid}>
          {/* Left: threat chart — sticky */}
          <div style={styles.chartCol}>
            <ThreatChart alerts={alerts} />
          </div>

          {/* Right: alert feed */}
          <div style={styles.feedCol}>
            <AlertFeed alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  wrap: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 24px 48px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--blocked-bg)',
    border: '1px solid var(--blocked-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    color: 'var(--blocked)',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '24px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  chartCol: {
    position: 'sticky',
    top: '80px',
  },
  feedCol: {},
}
