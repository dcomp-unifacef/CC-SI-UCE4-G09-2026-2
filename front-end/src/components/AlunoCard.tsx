import { Flame } from 'lucide-react'
import type { Aluno } from '../types'
import { corFaixa } from '../data/mockData'
import BadgeModalidade from './BadgeModalidade'
import FaixaBadge from './FaixaBadge'

interface Props {
  aluno: Aluno
  onClick?: () => void
}

export default function AlunoCard({ aluno, onClick }: Props) {
  const initials = aluno.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const statusColor =
    aluno.status === 'Ativo'
      ? '#4ade80'
      : aluno.status === 'Inadimplente'
      ? '#f87171'
      : '#a0a0a0'

  const ringColor = corFaixa(aluno.faixa)

  return (
    <button
      onClick={onClick}
      className="card-elevated animate-fade-in-up w-100 text-start p-0"
      style={{ background: 'none', border: '1px solid #2a2a2a', cursor: 'pointer' }}
    >
      <div className="p-4">
        <div className="d-flex align-items-start gap-3">
          {/* Avatar */}
          <div className="position-relative flex-shrink-0">
            <div
              className="avatar-initials"
              style={{
                width: 56,
                height: 56,
                fontSize: '1.125rem',
                outline: `2px solid ${ringColor}`,
                outlineOffset: 2,
              }}
            >
              {initials}
            </div>
            {aluno.streak >= 5 && (
              <span
                className="position-absolute d-flex align-items-center gap-1"
                style={{
                  bottom: -4,
                  right: -4,
                  background: '#0a0a0a',
                  border: '1px solid rgba(251,191,36,.4)',
                  borderRadius: '50rem',
                  padding: '1px 5px',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: '#fbbf24',
                }}
              >
                <Flame size={10} />
                {aluno.streak}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-fill min-w-0">
            <div className="d-flex align-items-start justify-content-between gap-2">
              <h3
                className="font-display mb-0 text-truncate"
                style={{ fontSize: '1.0625rem', letterSpacing: '0.03em' }}
              >
                {aluno.nome}
              </h3>
              <span
                className="pulse-dot flex-shrink-0"
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: statusColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {aluno.status}
              </span>
            </div>

            <p className="mb-2 text-muted-efc" style={{ fontSize: '0.75rem' }}>
              {aluno.idade} anos · {aluno.peso}kg · {aluno.altura.toFixed(2)}m
            </p>

            <div className="d-flex flex-wrap gap-1 mb-2">
              {aluno.modalidades.map((m) => (
                <BadgeModalidade key={m} modalidade={m} />
              ))}
            </div>

            <FaixaBadge faixa={aluno.faixa} />
          </div>
        </div>
      </div>
    </button>
  )
}
