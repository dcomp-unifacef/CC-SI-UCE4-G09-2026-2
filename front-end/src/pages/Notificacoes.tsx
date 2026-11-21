import { useState } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import { notificacoesMock } from '../data/mockData'
import type { Notificacao } from '../types'

type Tipo = Notificacao['tipo']

const tipoStyle: Record<Tipo, { bg: string; color: string; border: string }> = {
  info:    { bg: 'rgba(108,127,142,.1)', color: '#8a9dac', border: 'rgba(108,127,142,.3)' },
  warning: { bg: 'rgba(146,102,26,.1)',  color: '#fbbf24', border: 'rgba(146,102,26,.3)'  },
  danger:  { bg: 'rgba(127,29,29,.1)',   color: '#f87171', border: 'rgba(127,29,29,.3)'   },
  success: { bg: 'rgba(45,106,79,.1)',   color: '#4ade80', border: 'rgba(45,106,79,.3)'   },
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock)

  const marcarLida = (id: string) => {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)))
  }

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Central</p>
        <h1 className="page-title">NOTIFICAÇÕES</h1>
      </header>

      <div className="d-flex flex-column gap-3">
        {notificacoes.length === 0 && (
          <div
            className="card-elevated p-5 text-center text-muted-efc"
            style={{ fontSize: '0.875rem' }}
          >
            Nenhuma notificação.
          </div>
        )}

        {notificacoes.map((n) => {
          const s = tipoStyle[n.tipo]
          return (
            <div key={n.id} className="card-elevated p-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  {/* Ícone tipo */}
                  <div
                    className="flex-shrink-0 d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: 36, height: 36,
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      color: s.color,
                    }}
                  >
                    <Bell size={16} />
                  </div>

                  <div>
                    <p className="mb-1 fw-medium d-flex align-items-center gap-2" style={{ fontSize: '0.9375rem' }}>
                      {n.titulo}
                      {!n.lida && (
                        <span
                          style={{
                            display: 'inline-block', width: 7, height: 7,
                            borderRadius: '50%', background: '#6c7f8e',
                            verticalAlign: 'middle',
                          }}
                        />
                      )}
                    </p>
                    <p className="mb-1 text-muted-efc" style={{ fontSize: '0.875rem' }}>
                      {n.mensagem}
                    </p>
                    <p
                      className="mb-0 text-muted-efc"
                      style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {new Date(n.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {!n.lida && (
                  <button
                    className="btn btn-sm btn-outline-secondary flex-shrink-0 d-flex align-items-center gap-1"
                    onClick={() => marcarLida(n.id)}
                  >
                    <CheckCircle2 size={14} /> Marcar lida
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
