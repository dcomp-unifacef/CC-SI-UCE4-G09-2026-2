import type { LucideIcon } from 'lucide-react'

type Variant = 'default' | 'success' | 'danger' | 'warning'

interface Props {
  icon: LucideIcon
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  variation?: number
  variant?: Variant
}

const variantColor: Record<Variant, string> = {
  default: '#ffffff',
  success: '#4ade80',
  danger:  '#f87171',
  warning: '#fbbf24',
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  variation,
  variant = 'default',
}: Props) {
  const color = variantColor[variant]

  return (
    <div className="stat-card animate-fade-in-up">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div className="min-w-0">
          <p className="page-eyebrow mb-1">{label}</p>
          <p className="score mt-2" style={{ fontSize: '2.75rem', color }}>
            {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
          </p>
          {typeof variation === 'number' && (
            <p
              className="mt-2 mb-0"
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: variation >= 0 ? '#4ade80' : '#f87171',
              }}
            >
              {variation >= 0 ? '▲' : '▼'}{' '}
              {Math.abs(variation).toFixed(1)}% vs. mês anterior
            </p>
          )}
        </div>
        <div
          style={{
            border: '1px solid rgba(108,127,142,.4)',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            background: 'rgba(108,127,142,.1)',
            color: '#6c7f8e',
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
