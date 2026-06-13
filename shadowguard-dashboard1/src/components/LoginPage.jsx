import { useState } from 'react'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { loginRequest } from '../hooks/useAlerts'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginRequest(email, password)
      onLogin(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      {/* Scanline ambient effect */}
      <div style={styles.scanline} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <Shield size={20} color="var(--accent)" />
          </div>
          <span style={styles.logoText}>
            Shadow<span style={{ color: 'var(--accent)' }}>Guard</span>
          </span>
        </div>

        <p style={styles.subtitle}>ADMIN CONSOLE — RESTRICTED ACCESS</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@shadowguard.io"
            style={styles.input}
            required
            autoComplete="email"
          />

          <label style={styles.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ ...styles.input, paddingRight: '44px' }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              style={styles.eyeBtn}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              'AUTHENTICATE'
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Unauthorised access is prohibited and may be prosecuted.
        </p>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #0e141b 0%, var(--bg) 70%)',
  },
  scanline: {
    position: 'fixed',
    inset: 0,
    background:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 0 60px rgba(249,115,22,0.06), 0 24px 48px rgba(0,0,0,0.5)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    fontFamily: 'var(--sans)',
  },
  subtitle: {
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--muted)',
    letterSpacing: '0.12em',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginTop: '12px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'var(--blocked-bg)',
    border: '1px solid var(--blocked-border)',
    borderRadius: '6px',
    padding: '10px 12px',
    color: 'var(--blocked)',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    marginTop: '8px',
  },
  submitBtn: {
    marginTop: '20px',
    width: '100%',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    color: '#000',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.15s',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(0,0,0,0.3)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  footer: {
    marginTop: '24px',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--muted)',
    textAlign: 'center',
    letterSpacing: '0.04em',
    lineHeight: '1.6',
  },
}
