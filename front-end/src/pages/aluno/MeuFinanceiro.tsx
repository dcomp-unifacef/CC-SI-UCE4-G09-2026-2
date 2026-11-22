import { useEffect, useState } from 'react'
import { Wallet, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { AlunoMeAPI, FinanceiroAPI } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'

const statusStyle: Record<'pago' | 'aberto' | 'atrasado', { color: string; border: string; bg: string }> = {
  pago:     { color: '#4ade80', border: 'rgba(74,222,128,.3)',  bg: 'rgba(74,222,128,.1)'  },
  aberto:   { color: '#fbbf24', border: 'rgba(251,191,36,.3)',  bg: 'rgba(251,191,36,.1)'  },
  atrasado: { color: '#f87171', border: 'rgba(248,113,113,.3)', bg: 'rgba(248,113,113,.1)' },
}

interface Estado {
  aluno: AlunoMeAPI | null
  financeiro: FinanceiroAPI[]
}

export default function MeuFinanceiro() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [dados, setDados] = useState<Estado>({
    aluno: null,
    financeiro: [],
  })

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const [aluno, financeiro] = await Promise.all([
          alunoMeApi.obterPerfil(),
          alunoMeApi.obterFinanceiro(),
        ])
        setDados({ aluno, financeiro })
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Loader2 size={32} className="spin" style={{ color: '#6c7f8e' }} />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="d-flex flex-column gap-4">
        <div><p className="page-eyebrow">Mensalidade</p><h1 className="page-title">MEU FINANCEIRO</h1></div>
        <div className="card-elevated p-4" style={{ border: '1px solid rgba(248,113,113,.3)' }}>
          <p style={{ color: '#f87171', marginBottom: 0 }}>{erro}</p>
        </div>
      </div>
    )
  }

  const { aluno, financeiro } = dados

  if (!aluno) return null

  const pagos = financeiro.filter((p) => p.status === 'pago')
  const pendentes = financeiro.filter((p) => p.status !== 'pago')
  const totalPago = pagos.reduce((s, p) => s + p.valor, 0)
  const emDia = pendentes.length === 0

  const statusVal = aluno.status === 'ATIVO' ? 'ativo'
    : aluno.status === 'INADIMPLENTE' ? 'inadimplente'
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
            <p className="score mb-0" style={{ fontSize: '1.75rem' }}>R$ {aluno.valorMensalidade}</p>
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
          {financeiro.length === 0 && (
            <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
              Nenhum pagamento registrado.
            </p>
          )}
          {financeiro.map((p) => {
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
                    {p.dataPagamento ? new Date(p.dataPagamento).toLocaleDateString('pt-BR') : '—'} · {p.forma}
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
