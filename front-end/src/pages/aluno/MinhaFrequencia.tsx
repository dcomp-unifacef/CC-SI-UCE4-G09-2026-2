import { useEffect, useState } from 'react'
import { ClipboardCheck, Flame, CalendarCheck, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { AlunoMeAPI, PresencaAPI } from '../../services/api'
import StatCard from '../../components/StatCard'
import HeatmapPresenca from '../../components/HeatmapPresenca'

interface Estado {
  aluno: AlunoMeAPI | null
  presencas: PresencaAPI[]
}

export default function MinhaFrequencia() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [dados, setDados] = useState<Estado>({
    aluno: null,
    presencas: [],
  })

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const [aluno, presencas] = await Promise.all([
          alunoMeApi.obterPerfil(),
          alunoMeApi.obterFrequencia(),
        ])
        setDados({ aluno, presencas })
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
        <div><p className="page-eyebrow">Histórico</p><h1 className="page-title">MINHA FREQUÊNCIA</h1></div>
        <div className="card-elevated p-4" style={{ border: '1px solid rgba(248,113,113,.3)' }}>
          <p style={{ color: '#f87171', marginBottom: 0 }}>{erro}</p>
        </div>
      </div>
    )
  }

  const { aluno, presencas } = dados

  if (!aluno) return null

  // Calcular estatísticas
  const esteMes = presencas.filter((f) => {
    const m = new Date().toISOString().slice(0, 7)
    return f.data.startsWith(m)
  }).length

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Histórico</p>
        <h1 className="page-title">MINHA FREQUÊNCIA</h1>
      </header>

      <div className="row g-3">
        <div className="col-sm-4">
          <StatCard label="Total check-ins" value={presencas.length} icon={ClipboardCheck} />
        </div>
        <div className="col-sm-4">
          <StatCard label="Este mês" value={esteMes} icon={CalendarCheck} variant="success" />
        </div>
        <div className="col-sm-4">
          <StatCard label="Streak (dias)" value={aluno.streak} icon={Flame} variant="warning" />
        </div>
      </div>

      <div className="card-elevated p-4">
        <h2
          className="font-display mb-4"
          style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
        >
          HEATMAP — ÚLTIMOS 90 DIAS
        </h2>
        <HeatmapPresenca alunoId={String(aluno.id)} days={90} />
      </div>

      <div className="card-elevated p-4">
        <h2
          className="font-display mb-3"
          style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
        >
          HISTÓRICO RECENTE
        </h2>
        <div className="d-flex flex-column gap-2">
          {presencas.length === 0 && (
            <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
              Nenhum check-in registrado.
            </p>
          )}
          {presencas.slice(0, 20).map((f) => (
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
                  {f.hora}
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
