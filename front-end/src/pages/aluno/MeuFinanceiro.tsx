import { useMemo } from 'react'
import { Wallet, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { alunosMock, pagamentosMock } from '../../data/mockData'
import type { StatusPagamento } from '../../types'
import StatusBadge from '../../components/StatusBadge'

const statusStyle: Record<StatusPagamento, { color: string; border: string; bg: string }> = {
  pago:     { color: '#4ade80', border: 'rgba(74,222,128,.3)',  bg: 'rgba(74,222,128,.1)'  },
  aberto:   { color: '#fbbf24', border: 'rgba(251,191,36,.3)',  bg: 'rgba(251,191,36,.1)'  },
  atrasado: { color: '#f87171', border: 'rgba(248,113,113,.3)', bg: 'rgba(248,113,113,.1)' },
}

export default function MeuFinanceiro() {
  const { user } = useAuth()
  const id    = user?.alunoId ?? 'a2'
  const aluno = alunosMock.find((a) => a.id === id)

  const meus = useMemo(
    () =>
      pagamentosMock
        .filter((p) => p.alunoId === id)
        .sort((a, b) => b.data.localeCompare(a.data)),
    [id],
  )

  const pagos    = meus.filter((p) => p.status === 'pago')
  const pendentes = meus.filter((p) => p.status !== 'pago')
  const totalPago = pagos.reduce((s, p) => s + p.valor, 0)
  const emDia    = pendentes.length === 0

  if (!aluno) return null

  const statusVal = aluno.status === 'Ativo' ? 'ativo'
    : aluno.status === 'Inadimplente' ? 'inadimplente'
    : 'inativo'

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Mensalidade</p>
        <h1 className="page-title">MEU FINANCEIRO</h1>
      </header>

      {/* Banner status */}
      <div
        className="card-elevated p-4"
        style={{
          borderColor: emDia ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)',
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style={{
                width: 44, height: 44,
                background: emDia ? 'rgba(74,222,128,.1)' : 'rgba(248,113,113,.1)',
                color: emDia ? '#4ade80' : '#f87171',
              }}
            >
              {emDia ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <p className="page-eyebrow mb-0">Status</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1.0625rem' }}>
                {emDia
                  ? 'Mensalidade em dia'
                  : `${pendentes.length} pagamento(s) pendente(s)`}
              </p>
            </div>
          </div>
          <StatusBadge status={statusVal} />
        </div>
      </div>

      {/* Mini cards */}
      <div className="row g-3">
        <div className="col-sm-4">
          <div className="card-elevated p-4">
            <p className="page-eyebrow mb-1">Mensalidade</p>
            <p className="score mb-0" style={{ fontSize: '1.75rem' }}>R$ {aluno.mensalidade}</p>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-elevated p-4">
            <p className="page-eyebrow mb-1">Total pago</p>
            <p className="score mb-0" style={{ fontSize: '1.75rem', color: '#4ade80' }}>R$ {totalPago}</p>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-elevated p-4">
            <p className="page-eyebrow mb-1">Pendentes</p>
            <p
              className="score mb-0"
              style={{ fontSize: '1.75rem', color: pendentes.length > 0 ? '#fbbf24' : '#fff' }}
            >
              {pendentes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className="card-elevated p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Wallet size={16} style={{ color: '#6c7f8e' }} />
          <h2
            className="font-display mb-0"
            style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
          >
            HISTÓRICO DE PAGAMENTOS
          </h2>
        </div>

        <div className="d-flex flex-column gap-2">
          {meus.length === 0 && (
            <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
              Nenhum pagamento registrado.
            </p>
          )}
          {meus.map((p) => {
            const ss = statusStyle[p.status]
            return (
              <div
                key={p.id}
                className="d-flex align-items-center justify-content-between p-3 rounded"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <div>
                  <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>
                    Ref. {p.referenciaMes}
                  </p>
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                    {p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'} · {p.forma}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                    R$ {p.valor}
                  </span>
                  <span
                    className="rounded-pill px-2 py-1"
                    style={{
                      background: ss.bg, color: ss.color,
                      border: `1px solid ${ss.border}`,
                      fontSize: '0.6875rem', fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
