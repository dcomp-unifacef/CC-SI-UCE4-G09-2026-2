import { useMemo, useState } from 'react'
import {
  Wallet, AlertTriangle, CheckCircle2, TrendingUp,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  alunosMock, pagamentosMock, receitaMensalMock,
} from '../data/mockData'
import type { Pagamento } from '../types'
import StatCard from '../components/StatCard'

export default function Financeiro() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(pagamentosMock)

  const mesAtual = new Date().toISOString().slice(0, 7)
  const pagos     = pagamentos.filter((p) => p.status === 'pago' && p.referenciaMes === mesAtual)
  const pendentes = pagamentos.filter((p) => p.status !== 'pago' && p.referenciaMes === mesAtual)
  const receita   = pagos.reduce((s, p) => s + p.valor, 0)
  const esperado  = alunosMock.reduce((s, a) => s + a.mensalidade, 0)

  const ultimos = useMemo(
    () => [...pagos].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 8),
    [pagos],
  )

  const marcarPago = (id: string) => {
    // Mock local — integração real fica pendente
    setPagamentos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'pago' as const, data: new Date().toISOString().slice(0, 10) }
          : p,
      ),
    )
  }

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Gestão</p>
        <h1 className="page-title">FINANCEIRO</h1>
      </header>

      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={Wallet}        label="Esperado"  value={esperado} prefix="R$ " />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={CheckCircle2}  label="Recebido"  value={receita}  prefix="R$ " variant="success" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={AlertTriangle} label="A receber" value={esperado - receita} prefix="R$ " variant="warning" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={TrendingUp}    label="Pendentes" value={pendentes.length} variant="danger" />
        </div>
      </div>

      <div className="row g-3">
        {/* Gráfico */}
        <div className="col-lg-8">
          <div className="card-elevated p-4 h-100">
            <h3
              className="font-display mb-4"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
            >
              RECEITA — 6 MESES
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={receitaMensalMock} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="mes" stroke="#606060" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606060" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#111111', border: '1px solid #2a2a2a',
                    borderRadius: 8, fontSize: 12, color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#6c7f8e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6c7f8e' }}
                  name="Receita (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pendências */}
        <div className="col-lg-4">
          <div className="card-elevated p-4 h-100">
            <h3
              className="font-display mb-3 d-flex align-items-center gap-2"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
            >
              <AlertTriangle size={16} style={{ color: '#f87171' }} />
              PENDÊNCIAS
            </h3>

            {pendentes.length === 0 ? (
              <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
                Nenhuma pendência.
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendentes.map((p) => {
                  const aluno = alunosMock.find((a) => a.id === p.alunoId)
                  return (
                    <div
                      key={p.id}
                      className="d-flex align-items-center justify-content-between gap-2 p-3 rounded"
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    >
                      <div className="min-w-0">
                        <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                          {aluno?.nome ?? '—'}
                        </p>
                        <p
                          className="mb-0 pulse-dot"
                          style={{ fontSize: '0.75rem', color: '#f87171' }}
                        >
                          R$ {p.valor} em atraso
                        </p>
                      </div>
                      <button
                        className="btn btn-sm btn-primary flex-shrink-0"
                        onClick={() => marcarPago(p.id)}
                      >
                        Receber
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Últimos pagamentos */}
      <div className="card-elevated p-4">
        <h3
          className="font-display mb-3"
          style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
        >
          ÚLTIMOS PAGAMENTOS
        </h3>
        <div className="d-flex flex-column">
          {ultimos.map((p, i) => {
            const aluno = alunosMock.find((a) => a.id === p.alunoId)
            return (
              <div
                key={p.id}
                className="d-flex align-items-center justify-content-between py-3"
                style={{
                  borderBottom: i < ultimos.length - 1 ? '1px solid #1a1a1a' : 'none',
                  fontSize: '0.875rem',
                }}
              >
                <div>
                  <p className="mb-0 fw-medium">{aluno?.nome ?? '—'}</p>
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                    {p.forma} · {new Date(p.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className="font-display"
                  style={{ fontSize: '1.25rem', color: '#4ade80' }}
                >
                  R$ {p.valor}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
