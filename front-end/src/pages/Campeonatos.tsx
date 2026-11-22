import { useState, useEffect, useCallback } from 'react'
import { Calendar, MapPin, Users, Trophy, X, Plus, Loader2, Trash2 } from 'lucide-react'
import { campeonatosApi, alunosApi } from '../services/api'
import type { CampeonatoAPI, AlunoAPI } from '../services/api'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'

// const statusStyle: Record<StatusCampeonato, { bg: string; color: string; border: string }> = {
//   'Confirmado':         { bg: 'rgba(45,106,79,.15)',  color: '#4ade80', border: 'rgba(45,106,79,.3)' },
//   'Em organização':     { bg: 'rgba(146,102,26,.15)', color: '#fbbf24', border: 'rgba(146,102,26,.3)' },
//   'Inscrições abertas': { bg: 'rgba(108,127,142,.15)',color: '#8a9dac', border: 'rgba(108,127,142,.3)' },
//   'Encerrado':          { bg: 'rgba(42,42,42,.5)',    color: '#a0a0a0', border: '#2a2a2a' },
// }

const FORM_VAZIO = {
  nome: '', data: '', local: '', locomocao: '',
  valores: '0', descricao: '', pesosDeLuta: '',
}

interface ToastState { msg: string; type: 'success' | 'danger' | 'warning' }

export default function Campeonatos() {
  const [campeonatos, setCampeonatos] = useState<CampeonatoAPI[]>([])
  const [alunos, setAlunos]           = useState<AlunoAPI[]>([])
  const [loading, setLoading]         = useState(true)
  const [detalhe, setDetalhe]         = useState<CampeonatoAPI | null>(null)
  const [toast, setToast]             = useState<ToastState | null>(null)

  // Modal novo campeonato
  const [modalNovo, setModalNovo] = useState(false)
  const [form, setForm]           = useState(FORM_VAZIO)
  const [salvando, setSalvando]   = useState(false)
  const [erroForm, setErroForm]   = useState<string | null>(null)

  // Modal inscrever aluno
  const [modalInscricao, setModalInscricao] = useState(false)
  const [alunoSel, setAlunoSel]             = useState('')
  const [pesoSel, setPesoSel]               = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [cs, as] = await Promise.all([campeonatosApi.listar(), alunosApi.listar()])
      setCampeonatos(cs)
      setAlunos(as)
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const handleCriar = async () => {
    if (!form.nome.trim() || !form.data || !form.local.trim()) {
      setErroForm('Nome, data e local são obrigatórios.'); return
    }
    const pesos = form.pesosDeLuta.split(',').map((p) => p.trim()).filter(Boolean)
    if (pesos.length === 0) { setErroForm('Informe ao menos uma categoria de peso.'); return }

    setSalvando(true); setErroForm(null)
    try {
      const novo = await campeonatosApi.criar({
        nome: form.nome, data: form.data, local: form.local,
        locomocao: form.locomocao, valores: Number(form.valores),
        descricao: form.descricao, pesosDeLuta: pesos,
      })
      setCampeonatos((prev) => [...prev, novo])
      setToast({ msg: 'Campeonato criado!', type: 'success' })
      setModalNovo(false); setForm(FORM_VAZIO)
    } catch (e: any) {
      setErroForm(e.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async (c: CampeonatoAPI) => {
    try {
      await campeonatosApi.excluir(c.id)
      setCampeonatos((prev) => prev.filter((x) => x.id !== c.id))
      setDetalhe(null)
      setToast({ msg: 'Campeonato excluído.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  const handleInscrever = async () => {
    if (!detalhe || !alunoSel || !pesoSel) return
    try {
      const ins = await campeonatosApi.inscreverAluno(detalhe.id, Number(alunoSel), pesoSel)
      setCampeonatos((prev) => prev.map((c) =>
        c.id === detalhe.id ? { ...c, inscricoes: [...c.inscricoes, ins] } : c
      ))
      setDetalhe((d) => d ? { ...d, inscricoes: [...d.inscricoes, ins] } : d)
      setModalInscricao(false); setAlunoSel(''); setPesoSel('')
      setToast({ msg: 'Aluno inscrito!', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  const handleRemoverInscricao = async (campeonatoId: number, alunoId: number) => {
    try {
      await campeonatosApi.removerInscricao(campeonatoId, alunoId)
      const att = (prev: CampeonatoAPI[]) => prev.map((c) =>
        c.id === campeonatoId
          ? { ...c, inscricoes: c.inscricoes.filter((i) => i.alunoId !== alunoId) }
          : c
      )
      setCampeonatos(att)
      setDetalhe((d) => d ? { ...d, inscricoes: d.inscricoes.filter((i) => i.alunoId !== alunoId) } : d)
      setToast({ msg: 'Inscrição removida.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Competições</p><h1 className="page-title">CAMPEONATOS</h1></div>
      <SkeletonLoader rows={4} height="12rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Competições</p>
          <h1 className="page-title">CAMPEONATOS</h1>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setForm(FORM_VAZIO); setErroForm(null); setModalNovo(true) }}>
          <Plus size={16} /> Novo Campeonato
        </button>
      </header>

      {campeonatos.length === 0 && (
        <div className="card-elevated p-5 text-center text-muted-efc" style={{ fontSize: '0.875rem' }}>
          Nenhum campeonato cadastrado.
        </div>
      )}

      <div className="row g-4">
        {campeonatos.map((c) => {
          const total = c.inscricoes.length
          const max   = Math.max(10, c.pesosDeLuta.length * 4)
          const pct   = Math.min(100, Math.round((total / max) * 100))

          return (
            <div key={c.id} className="col-md-6 col-xl-4">
              <div className="card-elevated h-100 overflow-hidden" style={{ padding: 0 }}>
                <div className="position-relative champ-cover" style={{ height: 120 }}>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`hex-${c.id}`} width="40" height="46" patternUnits="userSpaceOnUse">
                        <path d="M20 0L40 12v22L20 46 0 34V12z" fill="none" stroke="white" strokeOpacity="0.4" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#hex-${c.id})`} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111111, transparent)' }} />
                  <Trophy size={28} style={{ position: 'absolute', bottom: 10, left: 16, color: 'rgba(108,127,142,.7)' }} />
                </div>

                <div className="p-4 d-flex flex-column gap-3">
                  <h3 className="font-display mb-0" style={{ fontSize: '1.0625rem', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                    {c.nome.toUpperCase()}
                  </h3>
                  <div className="d-flex flex-column gap-1 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    <p className="mb-0 d-flex align-items-center gap-2"><Calendar size={13} />
                      {new Date(c.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="mb-0 d-flex align-items-center gap-2"><MapPin size={13} />{c.local}</p>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1"
                      style={{ fontSize: '0.6875rem', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <span className="d-flex align-items-center gap-1"><Users size={11} /> Inscrições</span>
                      <span>{total} / {max}</span>
                    </div>
                    <div className="progress"><div className="progress-bar" style={{ width: `${pct}%` }} /></div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary flex-fill" onClick={() => setDetalhe(c)}>
                      Ver detalhes
                    </button>
                    <button className="btn p-2" style={{ color: '#f87171', border: '1px solid rgba(248,113,113,.3)', borderRadius: '0.5rem' }}
                      onClick={() => handleExcluir(c)} title="Excluir campeonato">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal detalhes */}
      {detalhe && (
        <>
          <div onClick={() => setDetalhe(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(640px, 95vw)', maxHeight: '85vh', overflowY: 'auto', zIndex: 1055,
          }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>
                  <Trophy size={16} className="me-2" style={{ color: '#6c7f8e' }} />
                  {detalhe.nome.toUpperCase()}
                </h5>
                <button className="btn p-1 lh-1" onClick={() => setDetalhe(null)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-4 d-flex flex-column gap-4">
                <div className="row g-3">
                  {[
                    { label: 'Data',      value: new Date(detalhe.data).toLocaleDateString('pt-BR') },
                    { label: 'Local',     value: detalhe.local },
                    { label: 'Locomoção', value: detalhe.locomocao },
                    { label: 'Valores',   value: detalhe.valores > 0 ? `R$ ${detalhe.valores}` : 'Gratuito' },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-sm-6">
                      <p className="page-eyebrow mb-1">{label}</p>
                      <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>{value}</p>
                    </div>
                  ))}
                </div>
                {detalhe.descricao && (
                  <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>{detalhe.descricao}</p>
                )}

                <div>
                  <p className="page-eyebrow mb-2">Categorias de peso</p>
                  <div className="d-flex flex-wrap gap-2">
                    {detalhe.pesosDeLuta.map((p) => (
                      <span key={p} className="px-2 py-1 rounded"
                        style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '0.75rem', color: '#a0a0a0' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="page-eyebrow mb-0">Inscritos ({detalhe.inscricoes.length})</p>
                    <button className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                      onClick={() => { setAlunoSel(''); setPesoSel(''); setModalInscricao(true) }}>
                      <Plus size={12} /> Inscrever aluno
                    </button>
                  </div>
                  {detalhe.inscricoes.length === 0 && (
                    <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>Nenhum inscrito ainda.</p>
                  )}
                  <div className="d-flex flex-column gap-1">
                    {detalhe.inscricoes.map((ins) => {
                      const aluno = alunos.find((a) => a.id === ins.alunoId)
                      return (
                        <div key={ins.id} className="d-flex align-items-center justify-content-between p-3 rounded"
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '0.875rem' }}>
                          <div>
                            <p className="mb-0 fw-medium">{aluno?.nome ?? `Aluno #${ins.alunoId}`}</p>
                            <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>{ins.pesoDeLuta}</p>
                          </div>
                          <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }}
                            onClick={() => handleRemoverInscricao(ins.campeonatoId, ins.alunoId)}
                            title="Remover inscrição"><Trash2 size={14} /></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal inscrever aluno */}
      {modalInscricao && detalhe && (
        <>
          <div onClick={() => setModalInscricao(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 1056 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(440px, 95vw)', zIndex: 1057,
          }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0">INSCREVER ALUNO</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalInscricao(false)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3 d-flex flex-column gap-3">
                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Aluno</label>
                  <select className="form-select" value={alunoSel} onChange={(e) => setAlunoSel(e.target.value)}>
                    <option value="">Selecione o aluno</option>
                    {alunos.filter((a) => !detalhe.inscricoes.some((i) => i.alunoId === a.id))
                      .map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Categoria de peso</label>
                  <select className="form-select" value={pesoSel} onChange={(e) => setPesoSel(e.target.value)}>
                    <option value="">Selecione a categoria</option>
                    {detalhe.pesosDeLuta.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalInscricao(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleInscrever} disabled={!alunoSel || !pesoSel}>
                  Confirmar inscrição
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal novo campeonato */}
      {modalNovo && (
        <>
          <div onClick={() => setModalNovo(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(560px, 95vw)', maxHeight: '90vh', overflowY: 'auto', zIndex: 1055,
          }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0">NOVO CAMPEONATO</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalNovo(false)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && (
                  <div className="p-2 mb-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroForm}
                  </div>
                )}
                <div className="row g-3">
                  {[
                    { label: 'Nome *', key: 'nome', type: 'text', col: '12' },
                    { label: 'Data *', key: 'data', type: 'date', col: '6' },
                    { label: 'Valores (R$)', key: 'valores', type: 'number', col: '6' },
                    { label: 'Local *', key: 'local', type: 'text', col: '6' },
                    { label: 'Locomoção', key: 'locomocao', type: 'text', col: '6' },
                  ].map(({ label, key, type, col }) => (
                    <div key={key} className={`col-${col}`}>
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>{label}</label>
                      <input type={type} className="form-control"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Descrição</label>
                    <textarea className="form-control" rows={2}
                      value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>
                      Categorias de peso * <span className="text-muted-efc" style={{ fontWeight: 400 }}>(separadas por vírgula)</span>
                    </label>
                    <input type="text" className="form-control" placeholder="Ex: Galo, Pena, Leve, Médio"
                      value={form.pesosDeLuta} onChange={(e) => setForm((p) => ({ ...p, pesosDeLuta: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalNovo(false)} disabled={salvando}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCriar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />}Criar Campeonato
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
