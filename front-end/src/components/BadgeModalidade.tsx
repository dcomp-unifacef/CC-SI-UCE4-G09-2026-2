import type { Modalidade } from '../types'

const styles: Record<Modalidade, { bg: string; color: string }> = {
  'Boxe':      { bg: 'rgba(74,85,104,.25)',  color: '#94a3b8' },
  'Muay Thai': { bg: 'rgba(74,98,116,.25)',  color: '#7eb8d4' },
  'Jiu-Jitsu': { bg: 'rgba(61,90,74,.25)',   color: '#6dba94' },
  'Funcional': { bg: 'rgba(85,85,85,.25)',   color: '#aaaaaa' },
}

interface Props {
  modalidade: Modalidade
  size?: 'sm' | 'md'
}

export default function BadgeModalidade({ modalidade, size = 'sm' }: Props) {
  const s = styles[modalidade]
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}40`,
        borderRadius: '50rem',
        padding: size === 'md' ? '0.25rem 0.75rem' : '0.1rem 0.5rem',
        fontSize: size === 'md' ? '0.8125rem' : '0.6875rem',
        fontWeight: 500,
        display: 'inline-block',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {modalidade}
    </span>
  )
}
