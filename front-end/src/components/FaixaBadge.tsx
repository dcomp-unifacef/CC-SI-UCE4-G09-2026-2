import type { Faixa } from '../types'
import { corFaixa } from '../data/mockData'

interface Props {
  faixa: Faixa
  showBar?: boolean
}

export default function FaixaBadge({ faixa, showBar = true }: Props) {
  const cor = corFaixa(faixa)
  return (
    <div className="d-flex flex-column gap-1">
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: cor,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {faixa}
      </span>
      {showBar && (
        <span
          className="faixa-bar"
          style={{ background: cor, opacity: 0.7 }}
        />
      )}
    </div>
  )
}
