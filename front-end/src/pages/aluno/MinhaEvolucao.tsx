import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Plus, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { AlunoMeAPI, EvolucaoAPI } from '../../services/api'
import GraficoEvolucaoReal from '../../components/GraficoEvolucaoReal'
import Toast from '../../components/Toast'
import SkeletonLoader from '../../components/SkeletonLoader'

interface ToastState { msg: string; type: 'success' | 'danger' }

export default function MinhaEvolucao() {
  const [aluno, setAluno]         = useState<AlunoMeAPI | null>(null)
  const [evolucoes, setEvolucoes] = useState<EvolucaoAPI[]>([])
  const [loading, setLoading]     = useState(true)
  const [erro, setErro]           = useState<string | null>(null)
  const [toast, setToast]         = useState<ToastState | null>(null)

  const [peso, setPeso]                   = useState('')
  const [bioimpedancia, setBioimpedancia] = useState('')
  const [salvando, setSalvando]           = useState(false)
  const [erroForm, setErroForm]           = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const [perfilAluno, evolucoesData] = await Promise.all([
        alunoMeApi.obterPerfil(),
        alunoMeApi.obterEvolucoes(),
      ])
      setAluno(perfilAluno)
      setEvolucoes(evolucoesData)
    } catch (e: any) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const minhasEvolucoes = evolucoes.sort((a, b) => 
    new Date(a.dataAvaliacao).getTime() - new Date(b.dataAvaliacao).getTime()
  )

  const ultimo   = minhasEvolucoes[minhasEvolucoes.length - 1]
  const primeiro = minhasEvolucoes[0]
  const diff     = ultimo && primeiro ? +(ultimo.pesoAtual - primeiro.pesoAtual).toFixed(1) : 0

  const registrar = async () => {
    const v = parseFloat(peso)
    const b = parseFloat(bioimpedancia)
    if (!v || v < 20 || v > 300) { 
      setErroForm('Informe um peso válido (20–300 kg).'); 
      return 
    }
    if (!b || b < 0) { 
      setErroForm('Informe a bioimpedância.'); 
      return 
    }

    setSalvando(true)
    setErroForm(null)
    try {
      const nova = await alunoMeApi.criarEvolucao({
        pesoAtual: v,
        bioimpedancia: b,
        dataAvaliacao: new Date().toISOString(),
      })
      setEvolucoes((prev) => [...prev, nova])
      setPeso('')
      setBioimpedancia('')
      setToast({ msg: 'Medição registrada!', type: 'success' })
    } catch (e: any) {
      setErroForm(e instanceof Error ? e.message : 'Erro ao registrar')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Progresso</p><h1 className="page-title">MINHA EVOLUÇÃO</h1></div>
      <SkeletonLoader rows={4} height="2rem" />
    </div>
  )

  if (erro) {
    return (
      <div className="d-flex flex-column gap-4">
        <div><p className="page-eyebrow">Progresso</p><h1 className="page-title">MINHA EVOLUÇÃO</h1></div>
        <div className="card-elevated p-4" style={{ border: '1px solid rgba(248,113,113,.3)' }}>
          <p style={{ color: '#f87171', marginBottom: 0 }}>{erro}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="animate-fade-in">
        <p className="page-eyebrow">Progresso</p>
        <h1 className="page-title">MINHA EVOLUÇÃO</h1>
        {aluno && (
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>{aluno.nome}</p>
        )}
      </header>

      <div className="row g-3">
        {[
          { 
            label: 'Peso atual',  
            value: `${ultimo?.pesoAtual ?? aluno?.peso ?? '—'} kg`,  
            color: '#fff' 
          },
          { 
            label: 'Variação',    
            value: `${diff > 0 ? '+' : ''}${diff} kg`,             
            color: diff < 0 ? '#4ade80' : diff > 0 ? '#fbbf24' : '#fff' 
          },
          { 
            label: 'Altura',      
            value: `${aluno?.altura.toFixed(2) ?? '—'} m`,           
            color: '#fff' 
          },
          { 
            label: 'Medições',    
            value: String(minhasEvolucoes.length),                 
            color: '#8a9dac' 
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-sm-6 col-md-3">
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
        {minhasEvolucoes.length === 0 ? (
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
            Nenhuma medição registrada. Adicione sua primeira medição abaixo.
          </p>
        ) : (
          <GraficoEvolucaoReal evolucoes={minhasEvolucoes} />
        )}
      </div>

      <div className="card-elevated p-4">
        <h2 className="font-display mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}>
          REGISTRAR NOVA MEDIÇÃO
        </h2>
        {erroForm && (
          <div className="p-2 mb-3 rounded" style={{ 
            background: 'rgba(127,29,29,.2)', 
            border: '1px solid rgba(248,113,113,.3)', 
            color: '#f87171', 
            fontSize: '0.8125rem' 
          }}>
            {erroForm}
          </div>
        )}
        <div className="row g-2">
          <div className="col-sm-5">
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Peso (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              className="form-control" 
              placeholder="Ex: 78.5"
              value={peso} 
              onChange={(e) => { setPeso(e.target.value); setErroForm(null) }} 
            />
          </div>
          <div className="col-sm-5">
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Bioimpedância (%)</label>
            <input 
              type="number" 
              step="0.1" 
              className="form-control" 
              placeholder="Ex: 18.5"
              value={bioimpedancia} 
              onChange={(e) => { setBioimpedancia(e.target.value); setErroForm(null) }} 
            />
          </div>
          <div className="col-sm-2 d-flex align-items-end">
            <button 
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={registrar} 
              disabled={salvando}
            >
              {salvando ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
              Salvar
            </button>
          </div>
        </div>

        {minhasEvolucoes.length > 0 && (
          <div className="mt-3 d-flex flex-column gap-1">
            {[...minhasEvolucoes].reverse().slice(0, 8).map((m) => (
              <div 
                key={m.id} 
                className="d-flex justify-content-between py-2"
                style={{ borderBottom: '1px solid #1a1a1a', fontSize: '0.875rem' }}
              >
                <span className="text-muted-efc">
                  {new Date(m.dataAvaliacao).toLocaleDateString('pt-BR')}
                </span>
                <span className="fw-medium">{m.pesoAtual} kg</span>
                <span className="text-muted-efc">{m.bioimpedancia}% bioimpedância</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
