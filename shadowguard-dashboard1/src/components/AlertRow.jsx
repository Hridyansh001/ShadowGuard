import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle, Ban, CheckCircle,
  X, Clock, Hash, Tag, FileText, ShieldAlert,
} from 'lucide-react'

const VERDICT_CONFIG = {
  BLOCKED: { color: 'var(--blocked)', bg: 'var(--blocked-bg)', border: 'var(--blocked-border)', accent: '#ef4444', Icon: Ban },
  WARNING:  { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)', accent: '#f59e0b', Icon: AlertTriangle },
  SAFE:     { color: 'var(--safe)',    bg: 'var(--safe-bg)',    border: 'var(--safe-border)',    accent: '#22c55e', Icon: CheckCircle },
}

function RiskBar({ score }) {
  const color = score >= 75 ? 'var(--blocked)' : score >= 40 ? 'var(--warning)' : 'var(--safe)'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
      <div style={{ width:'60px', height:'4px', background:'var(--border)', borderRadius:'2px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${score}%`, background:color, borderRadius:'2px' }} />
      </div>
      <span style={{ fontFamily:'var(--mono)', fontSize:'10px', color, minWidth:'28px' }}>{score}</span>
    </div>
  )
}

function AlertModal({ alert, onClose }) {
  const cfg = VERDICT_CONFIG[alert.verdict] || VERDICT_CONFIG.SAFE
  const { Icon } = cfg
  const score = alert.riskScore || 0
  const scoreColor = score >= 75 ? 'var(--blocked)' : score >= 40 ? 'var(--warning)' : 'var(--safe)'

  const time = new Date(alert.timestamp)
  const timeStr = isNaN(time.getTime()) ? '–' : time.toLocaleString(undefined, {
    month:'short', day:'numeric', year:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
  })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,0,0.72)', backdropFilter:'blur(5px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px', animation:'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:'var(--bg2)',
          border:'1px solid var(--border2)',
          borderTop:`3px solid ${cfg.accent}`,
          borderRadius:'14px',
          width:'100%', maxWidth:'600px', maxHeight:'82vh',
          display:'flex', flexDirection:'column',
          boxShadow:'0 32px 80px rgba(0,0,0,0.7)',
          animation:'fadeIn 0.18s ease',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'4px', border:'1px solid', borderRadius:'4px', padding:'3px 8px', fontFamily:'var(--mono)', fontSize:'9px', fontWeight:'700', letterSpacing:'0.08em', color:cfg.color, borderColor:cfg.border, background:cfg.bg }}>
              <Icon size={11} /><span>{alert.verdict}</span>
            </div>
            <span style={{ fontFamily:'var(--sans)', fontSize:'15px', fontWeight:'700', color:'var(--text)' }}>Alert Detail</span>
          </div>
          <button
            onClick={onClose}
            style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'6px', color:'var(--muted)', cursor:'pointer', padding:'6px', display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY:'auto', flex:1, padding:'20px', display:'flex', flexDirection:'column', gap:'22px' }}>

          {/* Risk score */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--mono)', fontSize:'10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              <ShieldAlert size={11} /><span>Risk Score</span>
            </div>
            <div style={{ marginTop:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'8px' }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:'11px', color:'var(--muted)' }}>0</span>
                <span style={{ fontFamily:'var(--mono)', fontSize:'28px', fontWeight:'800', color:scoreColor }}>
                  {score}<span style={{ fontSize:'13px', color:'var(--muted)', fontWeight:'400' }}>/100</span>
                </span>
                <span style={{ fontFamily:'var(--mono)', fontSize:'11px', color:'var(--muted)' }}>100</span>
              </div>
              <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${score}%`, background:scoreColor, borderRadius:'3px' }} />
              </div>
            </div>
          </div>

          {/* Scanned text */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--mono)', fontSize:'10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              <FileText size={11} /><span>Scanned Text</span>
            </div>
            <div style={{ marginTop:'10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', padding:'14px', fontFamily:'var(--mono)', fontSize:'12px', color:'var(--text)', lineHeight:'1.75', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
              {alert.mask || alert.text || '—'}
            </div>
          </div>

          {/* Original text if masked */}
          {alert.text && alert.mask && alert.text !== alert.mask && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--mono)', fontSize:'10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                <FileText size={11} /><span>Original Text</span>
              </div>
              <div style={{ marginTop:'10px', background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:'8px', padding:'14px', fontFamily:'var(--mono)', fontSize:'12px', color:'var(--text)', lineHeight:'1.75', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                {alert.text}
              </div>
            </div>
          )}

          {/* Trigger categories */}
          {(alert.topReasons || []).length > 0 && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--mono)', fontSize:'10px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                <Tag size={11} /><span>Trigger Categories</span>
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px' }}>
                {alert.topReasons.map((r, i) => (
                  <span key={i} style={{ border:'1px solid', borderRadius:'4px', padding:'4px 10px', fontFamily:'var(--mono)', fontSize:'10px', fontWeight:'600', color:cfg.color, borderColor:cfg.border, background:cfg.bg }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'12px' }}>
            {alert.id && (
              <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'var(--mono)', fontSize:'9px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                  <Hash size={10} /><span>Event ID</span>
                </div>
                <div style={{ fontFamily:'var(--mono)', fontSize:'11px', color:'var(--text)', wordBreak:'break-all', lineHeight:'1.5' }}>{alert.id}</div>
              </div>
            )}
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'var(--mono)', fontSize:'9px', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                <Clock size={10} /><span>Timestamp</span>
              </div>
              <div style={{ fontFamily:'var(--mono)', fontSize:'11px', color:'var(--text)', wordBreak:'break-all', lineHeight:'1.5' }}>{timeStr}</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderTop:'1px solid var(--border)', flexShrink:0 }}>
          <span style={{ fontFamily:'var(--mono)', fontSize:'10px', color:'var(--muted)' }}>
            Press{' '}
            <kbd style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'3px', padding:'1px 5px', fontFamily:'var(--mono)', fontSize:'10px', color:'var(--text)' }}>
              Esc
            </kbd>
            {' '}or click outside to close
          </span>
          <button
            onClick={onClose}
            style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'6px', color:'var(--text)', cursor:'pointer', padding:'7px 18px', fontFamily:'var(--mono)', fontSize:'11px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AlertRow({ alert }) {
  const [open, setOpen] = useState(false)
  const cfg = VERDICT_CONFIG[alert.verdict] || VERDICT_CONFIG.SAFE
  const { Icon } = cfg

  const time = new Date(alert.timestamp)
  const timeStr = isNaN(time.getTime()) ? '–' : time.toLocaleTimeString()
  const dateStr = isNaN(time.getTime()) ? '' : time.toLocaleDateString(undefined, { month:'short', day:'numeric' })

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderLeft:`3px solid ${cfg.accent}`, borderRadius:'10px',
          overflow:'hidden', cursor:'pointer', animation:'fadeIn 0.2s ease',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', gap:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', minWidth:0, flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'4px', border:'1px solid', borderRadius:'4px', padding:'3px 8px', fontFamily:'var(--mono)', fontSize:'9px', fontWeight:'700', letterSpacing:'0.08em', flexShrink:0, color:cfg.color, borderColor:cfg.border, background:cfg.bg }}>
              <Icon size={10} /><span>{alert.verdict}</span>
            </div>
            <div style={{ fontFamily:'var(--mono)', fontSize:'12px', color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {alert.mask || alert.text || '—'}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', flexShrink:0 }}>
            <RiskBar score={alert.riskScore || 0} />
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:'11px', color:'var(--text)' }}>{timeStr}</span>
              <span style={{ fontFamily:'var(--mono)', fontSize:'9px', color:'var(--muted)' }}>{dateStr}</span>
            </div>
            <div style={{ fontFamily:'var(--mono)', fontSize:'9px', color:'var(--muted)', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'4px', padding:'2px 7px', letterSpacing:'0.08em' }}>
              VIEW
            </div>
          </div>
        </div>
      </div>

      {open && <AlertModal alert={alert} onClose={() => setOpen(false)} />}
    </>
  )
}