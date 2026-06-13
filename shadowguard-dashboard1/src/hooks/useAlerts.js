import { useState, useEffect, useCallback } from 'react'

const BASE_URL = 'http://localhost:8080'

export function useAlerts(token, onUnauthorized) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncTime, setSyncTime] = useState('–')
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (res.status === 401 || res.status === 403) {
        onUnauthorized()
        return
      }
      const data = await res.json()
      setAlerts(Array.isArray(data) ? [...data].reverse() : [])
      setSyncTime(new Date().toLocaleTimeString())
    } catch (e) {
      setError('Connection failed — is your backend running?')
    } finally {
      setLoading(false)
    }
  }, [token, onUnauthorized])

  useEffect(() => {
    if (!token) return
    fetchData()
    const loop = setInterval(fetchData, 30000)
    return () => clearInterval(loop)
  }, [token, fetchData])

  const stats = {
    total: alerts.length,
    blocked: alerts.filter((a) => a.verdict === 'BLOCKED').length,
    warning: alerts.filter((a) => a.verdict === 'WARNING').length,
    safe: alerts.filter((a) => a.verdict === 'SAFE').length,
  }

  return { alerts, loading, syncTime, error, fetchData, stats }
}

export async function loginRequest(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}
