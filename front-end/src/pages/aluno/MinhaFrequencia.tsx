import { useMemo } from 'react'
import { ClipboardCheck, Flame, CalendarCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { alunosMock, frequenciasMock } from '../../data/mockData'
import StatCard from '../../components/StatCard'
import HeatmapPresenca from '../../components/HeatmapPresenca'

export default function MinhaFrequencia() {
  const { user } = useAuth()
  const id    = user?.alunoId ?? 'a2'
  const aluno = alunosMock.find((a) => a.id === id)

  const minhas = useMemo(
    () => frequenciasMock.filter((f) => f.alunoId === id),
    [id],
  )

  const esteMes = useMemo(() => {
    const m = new Date().toISOString().slice(0, 7)
    return minhas.filter((f) => f.data.startsWith(m)).length
  }, [minhas])

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Histórico</p>
        <h1 className="page-title">MINHA FREQUÊNCIA</h1>
      </header>

      <div className="row g-3">
        <div className="col-sm-4">
          <StatCard label="Total check-ins" value={minhas.length}      icon={ClipboardCheck} />
        </div>
        <div className="col-sm-4">
          <StatCard label="Este mês"        value={esteMes}            icon={CalendarCheck}  variant="success" />
        </div>
        <div className="col-sm-4">
          <StatCard label="Streak (dias)"   value={aluno?.streak ?? 0} icon={Flame}          variant="warning" />
        </div>
      </div>

      <div className="card-elevated p-4">
        <h2
          className="font-display mb-4"
          style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
        >
          HEATMAP — ÚLTIMOS 90 DIAS
        </h2>
        <HeatmapPresenca alunoId={id} days={90} />
      </div>

      <div className="card-elevated p-4">
        <h2
          className="font-display mb-3"
          style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
        >
          HISTÓRICO RECENTE
        </h2>
        <div className="d-flex flex-column gap-2">
          {minhas.length === 0 && (
            <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
              Nenhum check-in registrado.
            </p>
          )}
          {minhas.slice(0, 20).map((f) => (
            <div
              key={f.id}
              className="d-flex align-items-center justify-content-between p-3 rounded"
              style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}
            >
              <div>
                <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>
                  {new Date(f.data).toLocaleDateString('pt-BR')}
                </p>
                <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                  {f.hora} · {f.modalidade}
                </p>
              </div>
              <span
                className="rounded-pill px-2 py-1"
                style={{
                  background: 'rgba(74,222,128,.1)',
                  color: '#4ade80',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                Presente
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
