import { useMemo, useState } from 'react'
import { TrendingUp, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { alunosMock, medicoesMock } from '../../data/mockData'
import type { Medicao } from '../../types'
import GraficoEvolucao from '../../components/GraficoEvolucao'

export default function MinhaEvolucao() {
  const { user } = useAuth()
  const id    = user?.alunoId ?? 'a2'
  const aluno = alunosMock.find((a) => a.id === id)

  const [medicoes, setMedicoes] = useState<Record<string, Medicao[]>>({ ...medicoesMock })
  const [novoPeso, setNovoPeso] = useState('')
  const [erro, setErro]         = useState('')

  const minhas  = medicoes[id] ?? []
  const ultimo  = minhas[minhas.length - 1]
  const primeiro = minhas[0]
  const diff    = ultimo && primeiro ? +(ultimo.peso - primeiro.peso).toFixed(1) : 0

  const registrar = () => {
    const v = parseFloat(novoPeso)
    if (!v || v < 20 || v > 300) {
      setErro('Informe um peso válido (20–300 kg).')
      return
    }
    setErro('')
    setMedicoes((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), { data: new Date().toISOString().slice(0, 10), peso: v }],
    }))
    setNovoPeso('')
  }

  if (!aluno) return null

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Progresso</p>
        <h1 className="page-title">MINHA EVOLUÇÃO</h1>
      </header>

      <div className="row g-3">
        {[
          {
            label: 'Peso atual',
            value: `${ultimo?.peso ?? aluno.peso} kg`,
            color: '#fff',
          },
          {
            label: 'Variação',
            value: `${diff > 0 ? '+' : ''}${diff} kg`,
            color: diff < 0 ? '#4ade80' : diff > 0 ? '#fbbf24' : '#fff',
          },
          {
            label: 'Altura',
            value: `${aluno.altura.toFixed(2)} m`,
            color: '#fff',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-sm-4">
            <div className="card-elevated p-4">
              <p className="page-eyebrow mb-1">{label}</p>
              <p className="score mb-0" style={{ fontSize: '1.75rem', color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-elevated p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: '#6c7f8e' }} />
          <h2 className="font-display mb-0" style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}>
            EVOLUÇÃO DE PESO
          </h2>
        </div>
        <GraficoEvolucao alunoId={id} />
      </div>

      <div className="card-elevated p-4">
        <h2
          className="font-display mb-3"
          style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}
        >
          REGISTRAR NOVA MEDIÇÃO
        </h2>
        <div className="d-flex gap-2">
          <div className="flex-fill">
            <input
              type="number"
              step="0.1"
              className={`form-control ${erro ? 'is-invalid' : ''}`}
              placeholder="Peso em kg (ex: 78.5)"
              value={novoPeso}
              onChange={(e) => { setNovoPeso(e.target.value); setErro('') }}
            />
            {erro && <div className="invalid-feedback">{erro}</div>}
          </div>
          <button
            className="btn btn-primary flex-shrink-0 d-flex align-items-center gap-2"
            onClick={registrar}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {minhas.length > 0 && (
          <div className="mt-3 d-flex flex-column gap-1">
            {[...minhas].reverse().slice(0, 8).map((m, i) => (
              <div
                key={i}
                className="d-flex justify-content-between py-2"
                style={{ borderBottom: '1px solid #1a1a1a', fontSize: '0.875rem' }}
              >
                <span className="text-muted-efc">
                  {new Date(m.data).toLocaleDateString('pt-BR')}
                </span>
                <span className="fw-medium">{m.peso} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
