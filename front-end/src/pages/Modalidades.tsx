import { useState, useEffect, useCallback } from 'react'
import { Plus, X, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { modalidadesApi, turmasApi, aulasApi } from '../services/api'
import type { ModalidadeAPI, TurmaAPI, AulaAPI } from '../services/api'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'

type ToastState = { msg: string; type: 'success' | 'danger' | 'warning' }

const corPorNome = (nome: string): { bg: string; color: string } => {
  const n = nome.toLowerCase()
  if (n.includes('boxe'))    return { bg: 'rgba(74,85,104,.25)',  color: '#94a3b8' }
  if (n.includes('muay'))    return { bg: 'rgba(74,98,116,.25)',  color: '#7eb8d4' }
  if (n.includes('jiu'))     return { bg: 'rgba(61,90,74,.25)',   color: '#6dba94' }
  if (n.includes('funcional')) return { bg: 'rgba(85,85,85,.25)', color: '#aaaaaa' }
  return { bg: 'rgba(108,127,142,.25)', color: '#8a9dac' }
}

export default function Modalidades() {
  const [modalidades, setModalidades] = useState<ModalidadeAPI[]>([])
  const [turmas, setTurmas]           = useState<TurmaAPI[]>([])
  const [aulas, setAulas]             = useState<AulaAPI[]>([])
  const [loading, setLoading]         = useState(true)
  const [toast, setToast]             = useState<ToastState | null>(null)

  const [modalOpen, setModalOpen]   = useState(false)
  const [editMod, setEditMod]       = useState<ModalidadeAPI | null>(null)
  const [form, setForm]             = useState({ nome: '', turmaId: '' })
  const [salvando, setSalvando]     = useState(false)
  const [erroForm, setErroForm]     = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<ModalidadeAPI | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [ms, ts, as] = await Promise.all([
        modalidadesApi.listar(), turmasApi.listar(), aulasApi.listar(),
      ])
      setModalidades(ms); setTurmas(ts); setAulas(as)
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setEditMod(null); setForm({ nome: '', turmaId: '' }); setErroForm(null); setModalOpen(true)
  }

  const abrirEditar = (m: ModalidadeAPI) => {
    setEditMod(m); setForm({ nome: m.nome, turmaId: m.turmaId ? String(m.turmaId) : '' })
    setErroForm(null); setModalOpen(true)
  }

  const fechar = () => { setModalOpen(false); setEditMod(null) }

  const handleSalvar = async () => {
    if (!form.nome.trim()) { setErroForm('Nome é obrigatório.'); return }
    setSalvando(true); setErroForm(null)
    try {
      const payload = {
        nome: form.nome.trim(),
        ...(form.turmaId ? { turmaId: Number(form.turmaId) } : {}),
      }
      if (editMod) {
        const att = await modalidadesApi.atualizar(editMod.id, payload)
        setModalidades((prev) => prev.map((m) => (m.id === editMod.id ? att : m)))
        setToast({ msg: 'Modalidade atualizada!', type: 'success' })
      } else {
        const nova = await modalidadesApi.criar(payload)
        setModalidades((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome)))
        setToast({ msg: 'Modalidade cadastrada!', type: 'success' })
      }
      fechar()
    } catch (e: any) {
      setErroForm(e.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async (m: ModalidadeAPI) => {
    try {
      await modalidadesApi.excluir(m.id)
      setModalidades((prev) => prev.filter((x) => x.id !== m.id))
      setConfirmDel(null)
      setToast({ msg: `${m.nome} excluída.`, type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Catálogo</p><h1 className="page-title">MODALIDADES</h1></div>
      <SkeletonLoader rows={4} height="10rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Catálogo</p>
          <h1 className="page-title">MODALIDADES</h1>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={abrirNovo}>
          <Plus size={16} /> Nova Modalidade
        </button>
      </header>

      {modalidades.length === 0 ? (
        <div className="card-elevated p-5 text-center text-muted-efc" style={{ fontSize: '0.875rem' }}>
          Nenhuma modalidade cadastrada.
        </div>
      ) : (
        <div className="row g-4">
          {modalidades.map((m) => {
            const cor = corPorNome(m.nome)
            const totalAulas = aulas.filter((a) => a.modalidadeId === m.id).length
            const turmaVinculada = turmas.find((t) => t.id === m.turmaId)
            return (
              <div key={m.id} className="col-sm-6 col-xl-3">
                <div className="card-elevated p-4 h-100 d-flex flex-column gap-3 animate-fade-in-up">
                  {/* Badge nome */}
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{
                      background: cor.bg, color: cor.color,
                      border: `1px solid ${cor.color}40`,
                      borderRadius: '50rem', padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem', fontWeight: 500,
                    }}>
                      {m.nome}
                    </span>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm p-1 lh-1 text-muted-efc" title="Editar"
                        onClick={() => abrirEditar(m)}><Pencil size={13} /></button>
                      <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }} title="Excluir"
                        onClick={() => setConfirmDel(m)}><Trash2 size={13} /></button>
                    </div>
                  </div>

                  {turmaVinculada && (
                    <p className="text-muted-efc mb-0" style={{ fontSize: '0.75rem' }}>
                      Turma: {turmaVinculada.nome}
                    </p>
                  )}

                  <div className="row g-2 mt-auto">
                    <div className="col-6">
                      <div className="p-3 rounded text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <p className="page-eyebrow mb-1">Aulas/sem</p>
                        <p className="score mb-0" style={{ fontSize: '2.25rem' }}>{totalAulas}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <p className="page-eyebrow mb-1">Turmas</p>
                        <p className="score mb-0" style={{ fontSize: '2.25rem' }}>
                          {m.turmaId ? 1 : 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="d-flex align-items-center gap-1 mb-0 text-muted-efc"
                    style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <Users size={12} /> Ativos no sistema
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal cadastro/edição */}
      {modalOpen && (
        <>
          <div onClick={fechar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(480px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0">{editMod ? 'EDITAR MODALIDADE' : 'NOVA MODALIDADE'}</h5>
                <button className="btn p-1 lh-1" onClick={fechar}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && (
                  <div className="p-2 mb-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroForm}
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nome *</label>
                    <input type="text" className="form-control" placeholder="Ex: Muay Thai, Jiu-Jitsu"
                      value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Turma vinculada (opcional)</label>
                    <select className="form-select" value={form.turmaId}
                      onChange={(e) => setForm((p) => ({ ...p, turmaId: e.target.value }))}>
                      <option value="">Sem turma vinculada</option>
                      {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={fechar} disabled={salvando}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSalvar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />}
                  {editMod ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal confirmar exclusão */}
      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(380px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-4 text-center">
              <Trash2 size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
              <h5 className="font-display mb-2">CONFIRMAR EXCLUSÃO</h5>
              <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                Excluir a modalidade <strong style={{ color: '#fff' }}>{confirmDel.nome}</strong>?
                Modalidades com aulas vinculadas não podem ser excluídas.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
                <button className="btn" style={{ background: 'rgba(127,29,29,.3)', color: '#f87171', border: '1px solid rgba(248,113,113,.3)' }}
                  onClick={() => handleExcluir(confirmDel)}>Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
