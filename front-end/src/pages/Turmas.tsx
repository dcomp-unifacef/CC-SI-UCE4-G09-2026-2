import { useState, useEffect, useCallback, useMemo } from 'react'
import { CalendarOff, Users, Plus, X, Pencil, Trash2, Loader2, List, Calendar } from 'lucide-react'
import { aulasApi, turmasApi, professoresApi, modalidadesApi } from '../services/api'
import type { AulaAPI, TurmaAPI, ProfessorAPI, ModalidadeAPI, CreateAulaInput } from '../services/api'
import BadgeModalidade from '../components/BadgeModalidade'
import type { Modalidade } from '../types'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

type ToastState = { msg: string; type: 'success' | 'danger' | 'warning' }
type TabView = 'grade' | 'turmas'

const AULA_VAZIO = {
  data: '', horarioInicio: '', duracaoMinutos: '60', capacidade: '15',
  observacao: '', professorId: '', modalidadeId: '', turmaId: '',
}

const TURMA_VAZIO = { nome: '' }

function getModalidadeNome(nomeAPI: string): Modalidade {
  const map: Record<string, Modalidade> = {
    'muay thai': 'Muay Thai',
    'jiu-jitsu': 'Jiu-Jitsu',
    'jiu jitsu': 'Jiu-Jitsu',
    'boxe': 'Boxe',
    'funcional': 'Funcional',
  }
  return map[nomeAPI.toLowerCase()] ?? 'Funcional'
}

export default function Turmas() {
  const [aulas, setAulas]           = useState<AulaAPI[]>([])
  const [turmas, setTurmas]         = useState<TurmaAPI[]>([])
  const [professores, setProfessores] = useState<ProfessorAPI[]>([])
  const [modalidades, setModalidades] = useState<ModalidadeAPI[]>([])
  const [loading, setLoading]       = useState(true)
  const [erro, setErro]             = useState<string | null>(null)
  const [toast, setToast]           = useState<ToastState | null>(null)
  const [tab, setTab]               = useState<TabView>('grade')

  // Modal aula
  const [modalAula, setModalAula]     = useState(false)
  const [editAula, setEditAula]       = useState<AulaAPI | null>(null)
  const [formAula, setFormAula]       = useState(AULA_VAZIO)
  const [salvandoAula, setSalvandoAula] = useState(false)
  const [erroAula, setErroAula]       = useState<string | null>(null)

  // Modal turma
  const [modalTurma, setModalTurma]   = useState(false)
  const [editTurma, setEditTurma]     = useState<TurmaAPI | null>(null)
  const [formTurma, setFormTurma]     = useState(TURMA_VAZIO)
  const [salvandoTurma, setSalvandoTurma] = useState(false)
  const [erroTurma, setErroTurma]     = useState<string | null>(null)
  const [confirmDelTurma, setConfirmDelTurma] = useState<TurmaAPI | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true); setErro(null)
    try {
      const [as, ts, ps, ms] = await Promise.all([
        aulasApi.listar(), turmasApi.listar(),
        professoresApi.listarAtivos(), modalidadesApi.listar(),
      ])
      setAulas(as); setTurmas(ts); setProfessores(ps); setModalidades(ms)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  // Grade semanal
  const semana = useMemo(() => {
    const map: Record<number, AulaAPI[]> = {}
    for (let i = 0; i < 7; i++) map[i] = []
    aulas.forEach((a) => map[a.diaSemana]?.push(a))
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio)))
    return map
  }, [aulas])

  // ---- Aulas ----
  const abrirNovaAula = () => {
    setEditAula(null); setFormAula(AULA_VAZIO); setErroAula(null); setModalAula(true)
  }

  const abrirEditarAula = (a: AulaAPI) => {
    setEditAula(a)
    setFormAula({
      data: new Date(a.data).toISOString().slice(0, 10),
      horarioInicio: a.horarioInicio,
      duracaoMinutos: String(a.duracaoMinutos),
      capacidade: String(a.capacidade),
      observacao: a.observacao,
      professorId: String(a.professorId),
      modalidadeId: String(a.modalidadeId),
      turmaId: String(a.turmaId),
    })
    setErroAula(null); setModalAula(true)
  }

  const fecharAula = () => { setModalAula(false); setEditAula(null) }

  const handleSalvarAula = async () => {
    if (!formAula.data || !formAula.horarioInicio || !formAula.professorId || !formAula.modalidadeId || !formAula.turmaId) {
      setErroAula('Preencha todos os campos obrigatórios.'); return
    }
    setSalvandoAula(true); setErroAula(null)
    try {
      const payload: CreateAulaInput = {
        data: `${formAula.data}T${formAula.horarioInicio}:00.000Z`,
        horarioInicio: formAula.horarioInicio,
        duracaoMinutos: Number(formAula.duracaoMinutos),
        capacidade: Number(formAula.capacidade),
        observacao: formAula.observacao,
        professorId: Number(formAula.professorId),
        modalidadeId: Number(formAula.modalidadeId),
        turmaId: Number(formAula.turmaId),
      }
      if (editAula) {
        const att = await aulasApi.atualizar(editAula.id, payload)
        setAulas((prev) => prev.map((a) => (a.id === editAula.id ? att : a)))
        setToast({ msg: 'Aula atualizada!', type: 'success' })
      } else {
        const nova = await aulasApi.criar(payload)
        setAulas((prev) => [...prev, nova])
        setToast({ msg: 'Aula criada!', type: 'success' })
      }
      fecharAula()
    } catch (e: any) {
      setErroAula(e.message)
    } finally {
      setSalvandoAula(false)
    }
  }

  const handleCancelarAula = async (a: AulaAPI) => {
    try {
      await aulasApi.excluir(a.id)
      setAulas((prev) => prev.filter((x) => x.id !== a.id))
      setToast({ msg: 'Aula removida.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  // ---- Turmas ----
  const abrirNovaTurma = () => {
    setEditTurma(null); setFormTurma(TURMA_VAZIO); setErroTurma(null); setModalTurma(true)
  }

  const abrirEditarTurma = (t: TurmaAPI) => {
    setEditTurma(t); setFormTurma({ nome: t.nome }); setErroTurma(null); setModalTurma(true)
  }

  const fecharTurma = () => { setModalTurma(false); setEditTurma(null) }

  const handleSalvarTurma = async () => {
    if (!formTurma.nome.trim()) { setErroTurma('Nome é obrigatório.'); return }
    setSalvandoTurma(true); setErroTurma(null)
    try {
      if (editTurma) {
        const att = await turmasApi.atualizar(editTurma.id, { nome: formTurma.nome })
        setTurmas((prev) => prev.map((t) => (t.id === editTurma.id ? att : t)))
        setToast({ msg: 'Turma atualizada!', type: 'success' })
      } else {
        const nova = await turmasApi.criar({ nome: formTurma.nome })
        setTurmas((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome)))
        setToast({ msg: 'Turma criada!', type: 'success' })
      }
      fecharTurma()
    } catch (e: any) {
      setErroTurma(e.message)
    } finally {
      setSalvandoTurma(false)
    }
  }

  const handleExcluirTurma = async (t: TurmaAPI) => {
    try {
      await turmasApi.excluir(t.id)
      setTurmas((prev) => prev.filter((x) => x.id !== t.id))
      setConfirmDelTurma(null)
      setToast({ msg: 'Turma excluída.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
      setConfirmDelTurma(null)
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Cronograma</p><h1 className="page-title">AULAS &amp; TURMAS</h1></div>
      <SkeletonLoader rows={6} height="8rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Cronograma</p>
          <h1 className="page-title">AULAS &amp; TURMAS</h1>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={abrirNovaTurma}>
            <Plus size={16} /> Nova Turma
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={abrirNovaAula}>
            <Plus size={16} /> Nova Aula
          </button>
        </div>
      </header>

      {erro && (
        <div className="p-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.875rem' }}>
          {erro}
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${tab === 'grade' ? 'active' : ''}`}
            onClick={() => setTab('grade')}>
            <Calendar size={15} /> Grade Semanal
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${tab === 'turmas' ? 'active' : ''}`}
            onClick={() => setTab('turmas')}>
            <List size={15} /> Turmas ({turmas.length})
          </button>
        </li>
      </ul>

      {/* TAB: Grade Semanal */}
      {tab === 'grade' && (
        <div className="row g-3">
          {Array.from({ length: 7 }).map((_, dia) => (
            <div key={dia} className="col-sm-6 col-lg-3 col-xl">
              <div className="card-elevated p-3 h-100">
                <h3 className="font-display text-center mb-3"
                  style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', color: '#a0a0a0' }}>
                  {DIAS[dia].toUpperCase()}
                </h3>
                <div className="d-flex flex-column gap-2">
                  {semana[dia].length === 0 ? (
                    <div className="text-center p-3 rounded text-muted-efc"
                      style={{ border: '1px dashed #2a2a2a', fontSize: '0.6875rem' }}>
                      Sem aulas
                    </div>
                  ) : semana[dia].map((a) => (
                    <div key={a.id} className="rounded p-2"
                      style={{ border: '1px solid #2a2a2a', background: '#1a1a1a', fontSize: '0.75rem' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="font-display" style={{ fontSize: '1rem', color: '#6c7f8e' }}>
                          {a.horarioInicio}
                        </span>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm p-0 lh-1 text-muted-efc" title="Editar"
                            onClick={() => abrirEditarAula(a)}><Pencil size={11} /></button>
                        </div>
                      </div>
                      <p className="mb-1 fw-medium" style={{ fontSize: '0.8125rem' }}>
                        {a.turma?.nome ?? '—'}
                      </p>
                      <p className="mb-1 text-muted-efc">
                        Prof. {a.professor?.nome.split(' ')[0] ?? '—'}
                      </p>
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        {a.modalidade && (
                          <BadgeModalidade modalidade={getModalidadeNome(a.modalidade.nome)} />
                        )}
                        <span className="d-flex align-items-center gap-1 text-muted-efc"
                          style={{ fontSize: '0.6875rem' }}>
                          <Users size={10} /> {a.capacidade} vagas
                        </span>
                      </div>
                      <button
                        className="btn btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
                        style={{ height: 28, fontSize: '0.6875rem', color: '#f87171', background: 'transparent', border: '1px solid rgba(248,113,113,.3)' }}
                        onClick={() => handleCancelarAula(a)}>
                        <CalendarOff size={12} /> Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Turmas */}
      {tab === 'turmas' && (
        <div className="d-flex flex-column gap-3">
          {turmas.length === 0 ? (
            <div className="card-elevated p-5 text-center text-muted-efc" style={{ fontSize: '0.875rem' }}>
              Nenhuma turma cadastrada.
            </div>
          ) : turmas.map((t) => (
            <div key={t.id} className="card-elevated p-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="flex-fill">
                  <h3 className="font-display mb-1" style={{ fontSize: '1.125rem', letterSpacing: '0.05em' }}>
                    {t.nome}
                  </h3>
                  <div className="d-flex flex-wrap gap-2 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    <span className="d-flex align-items-center gap-1">
                      <Users size={13} /> {t.alunos.length} aluno(s)
                    </span>
                    <span>·</span>
                    <span>{t.aulas.length} aula(s)</span>
                    {t.modalidades.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{t.modalidades.map((m) => m.nome).join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm p-1 lh-1 text-muted-efc" title="Editar"
                    onClick={() => abrirEditarTurma(t)}><Pencil size={14} /></button>
                  <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }} title="Excluir"
                    onClick={() => setConfirmDelTurma(t)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova/Editar Aula */}
      {modalAula && (
        <>
          <div onClick={fecharAula} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(600px,95vw)', maxHeight: '90vh', overflowY: 'auto', zIndex: 1055 }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0">{editAula ? 'EDITAR AULA' : 'NOVA AULA'}</h5>
                <button className="btn p-1 lh-1" onClick={fecharAula}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroAula && (
                  <div className="p-2 mb-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroAula}
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Data *</label>
                    <input type="date" className="form-control"
                      value={formAula.data} onChange={(e) => setFormAula((p) => ({ ...p, data: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Horário de início *</label>
                    <input type="time" className="form-control"
                      value={formAula.horarioInicio} onChange={(e) => setFormAula((p) => ({ ...p, horarioInicio: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Duração (minutos)</label>
                    <input type="number" className="form-control" min={15} step={15}
                      value={formAula.duracaoMinutos} onChange={(e) => setFormAula((p) => ({ ...p, duracaoMinutos: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Capacidade *</label>
                    <input type="number" className="form-control" min={1}
                      value={formAula.capacidade} onChange={(e) => setFormAula((p) => ({ ...p, capacidade: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Professor *</label>
                    <select className="form-select" value={formAula.professorId}
                      onChange={(e) => setFormAula((p) => ({ ...p, professorId: e.target.value }))}>
                      <option value="">Selecione</option>
                      {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Modalidade *</label>
                    <select className="form-select" value={formAula.modalidadeId}
                      onChange={(e) => setFormAula((p) => ({ ...p, modalidadeId: e.target.value }))}>
                      <option value="">Selecione</option>
                      {modalidades.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Turma *</label>
                    <select className="form-select" value={formAula.turmaId}
                      onChange={(e) => setFormAula((p) => ({ ...p, turmaId: e.target.value }))}>
                      <option value="">Selecione</option>
                      {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Observação</label>
                    <input type="text" className="form-control" placeholder="Opcional"
                      value={formAula.observacao} onChange={(e) => setFormAula((p) => ({ ...p, observacao: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={fecharAula} disabled={salvandoAula}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSalvarAula} disabled={salvandoAula}>
                  {salvandoAula && <Loader2 size={14} className="spin" />}
                  {editAula ? 'Salvar' : 'Criar Aula'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Nova/Editar Turma */}
      {modalTurma && (
        <>
          <div onClick={fecharTurma} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(440px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0">{editTurma ? 'EDITAR TURMA' : 'NOVA TURMA'}</h5>
                <button className="btn p-1 lh-1" onClick={fecharTurma}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroTurma && (
                  <div className="p-2 mb-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroTurma}
                  </div>
                )}
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nome *</label>
                <input type="text" className="form-control" placeholder="Ex: Turma Muay Thai Avançado"
                  value={formTurma.nome} onChange={(e) => setFormTurma({ nome: e.target.value })} />
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={fecharTurma} disabled={salvandoTurma}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSalvarTurma} disabled={salvandoTurma}>
                  {salvandoTurma && <Loader2 size={14} className="spin" />}
                  {editTurma ? 'Salvar' : 'Criar Turma'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal confirmar exclusão de turma */}
      {confirmDelTurma && (
        <>
          <div onClick={() => setConfirmDelTurma(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(400px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-4 text-center">
              <Trash2 size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
              <h5 className="font-display mb-2">CONFIRMAR EXCLUSÃO</h5>
              <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                Excluir <strong style={{ color: '#fff' }}>{confirmDelTurma.nome}</strong>?
                Turmas com aulas vinculadas não podem ser excluídas.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-secondary" onClick={() => setConfirmDelTurma(null)}>Cancelar</button>
                <button className="btn" style={{ background: 'rgba(127,29,29,.3)', color: '#f87171', border: '1px solid rgba(248,113,113,.3)' }}
                  onClick={() => handleExcluirTurma(confirmDelTurma)}>Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
