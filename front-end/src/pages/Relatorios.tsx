import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { alunosMock, pagamentosMock, frequenciasMock } from '../data/mockData'

const mesAtual = new Date().toISOString().slice(0, 7)

export default function Relatorios() {
  const totalAlunos  = alunosMock.length
  const ativos       = alunosMock.filter((a) => a.status === 'Ativo').length
  const receita      = pagamentosMock
    .filter((p) => p.status === 'pago' && p.referenciaMes === mesAtual)
    .reduce((s, p) => s + p.valor, 0)
  const checkinsMes  = frequenciasMock.filter((f) => f.data.startsWith(mesAtual)).length

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Análises</p>
        <h1 className="page-title">RELATÓRIOS</h1>
      </header>

      <div className="row g-3">
        {[
          { icon: Users,      label: 'Total de alunos',    value: String(totalAlunos),     color: '#fff' },
          { icon: TrendingUp, label: 'Alunos ativos',      value: String(ativos),          color: '#4ade80' },
          { icon: DollarSign, label: 'Receita do mês',     value: `R$ ${receita}`,         color: '#8a9dac' },
          { icon: Calendar,   label: 'Check-ins no mês',   value: String(checkinsMes),     color: '#fbbf24' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="col-sm-6 col-xl-3">
            <div className="card-elevated p-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <p className="page-eyebrow mb-1">{label}</p>
                  <p className="score mb-0" style={{ fontSize: '2rem', color }}>{value}</p>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                  style={{
                    width: 40, height: 40,
                    background: 'rgba(108,127,142,.1)',
                    color: '#6c7f8e',
                    border: '1px solid rgba(108,127,142,.3)',
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-elevated p-5 text-center">
        <BarChart3 size={48} className="text-muted-efc mb-3" />
        <h2 className="font-display mb-2" style={{ fontSize: '1.25rem', letterSpacing: '0.08em' }}>
          RELATÓRIOS DETALHADOS
        </h2>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
          Exportação e relatórios avançados dependem de integração com o backend.
        </p>
      </div>
    </div>
  )
}
