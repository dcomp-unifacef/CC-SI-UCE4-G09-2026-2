import { useEffect } from 'react'

export type ToastType = 'success' | 'danger' | 'warning' | 'info'

interface Props {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const colors: Record<ToastType, { bg: string; color: string; border: string }> = {
  success: { bg: 'rgba(45,106,79,.2)',   color: '#4ade80', border: 'rgba(74,222,128,.3)' },
  danger:  { bg: 'rgba(127,29,29,.2)',   color: '#f87171', border: 'rgba(248,113,113,.3)' },
  warning: { bg: 'rgba(146,102,26,.2)',  color: '#fbbf24', border: 'rgba(251,191,36,.3)' },
  info:    { bg: 'rgba(108,127,142,.2)', color: '#8a9dac', border: 'rgba(108,127,142,.3)' },
}

export default function Toast({ message, type, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const c = colors[type]

  return (
    <div
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        background: c.bg, color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: '0.625rem',
        padding: '0.875rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(0,0,0,.5)',
        maxWidth: 360,
        animation: 'fade-in-up 0.25s ease-out',
      }}
    >
      {message}
    </div>
  )
}
