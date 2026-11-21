import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus, X, Pencil, Trash2, Loader2, Search,
  Users, UserX, UserCheck, ChevronDown, ChevronUp,
} from 'lucide-react'
import { professoresApi } from '../services/api'
import type { ProfessorAPI } from '../services/api'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'
import BadgeModalidade from '../components/BadgeModalidade'
import type { Modalidade } from '../types'

type ToastState = { msg: string; type: 'success' | 'danger' | 'warning' | 'info' }
type Filtro = 'todos' | 'ativos' | 'inativos'

const FORM_VAZIO = { cpf: '', nome: '', especialidade: '', contato: '' }

function getModalidade(nome: string): Modalidade | null {
  const n = nome.toLowerCase()
  if (n.includes('boxe'))      return 'Boxe'
  if (n.includes('muay'))      return 'Muay Thai'
  if (n.includes('jiu'))       return 'Jiu-Jitsu'
  if (n.includes('funcional')) return 'Funcional'
  return null
}

export default function Professores() {
  const [professores, setProfessores] = useState<ProfessorAPI[]>([])
  const [loading, setLoading]         = useState(true)
  const [busca, setBusca]             = useState('')
  const [filtro, setFiltro]           = useState<Filtro>('ativos')
  const [toast, setToast]             = useState<ToastState | null>(null)
  const [expandido, setExpandido]     = useState<number | null>(null)

  // Modal cadastro/edição
  const [modalOpen, setModalOpen] = useState(false)
  const [editProf, setEditProf]   = useState<ProfessorAPI | null>(null)
  const [form, setForm]           = useState(FORM_VAZIO)
  const [salvando, setSalvando]   = useState(false)
  const [erroForm, setErroForm]   = useState<string | null>(null)

  // Modal confirmação de exclusão/inativação
  const [confirmDel, setConfirmDel] = useState<ProfessorAPI | null>(null)
  const [acaoConfirm, setAcaoConfirm] = useState<'excluir' | 'inativar'>('excluir')

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setProfessores(await professoresApi.listar())
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  // Filtro local
  const filtrados = useMemo(() => {
    let lista = professores
    if (filtro === 'ativos')   lista = lista.filter((p) => p.ativo)
    if (filtro === 'inativos') lista = lista.filter((p) => !p.ativo)
    if (busca) {
      const q = busca.toLowerCase()
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(q) ||
        p.especialidade.toLowerCase().includes(q) ||
        p.cpf.includes(q)
      )
    }
    return lista
  }, [professores, filtro, busca])

  // Contagens
  const totalAtivos   = professores.filter((p) => p.ativo).length
  const totalInativos = professores.filter((p) => !p.ativo).length

  // ---- Modal cadastro/edição ----
  const abrirNovo = () => {
    setEditProf(null); setForm(FORM_VAZIO); setErroForm(null); setModalOpen(true)
  }

  const abrirEditar = (p: ProfessorAPI) => {
    setEditProf(p)
    setForm({ cpf: p.cpf, nome: p.nome, especialidade: p.especialidade, contato: p.contato })
    setErroForm(null); setModalOpen(true)
  }

  const fechar = () => { setModalOpen(false); setEditProf(null) }

  const handleSalvar = async () => {
    if (!form.nome.trim())          { setErroForm('Nome é obrigatório.');          return }
    if (!editProf && !form.cpf.trim()) { setErroForm('CPF é obrigatório.');        return }
    if (!form.especialidade.trim()) { setErroForm('Especialidade é obrigatória.'); return }
    if (!form.contato.trim())       { setErroForm('Contato é obrigatório.');       return }

    setSalvando(true); setErroForm(null)
    try {
      if (editProf) {
        const att = await professoresApi.atualizar(editProf.id, {
          nome: form.nome.trim(),
          especialidade: form.especialidade.trim(),
          contato: form.contato.trim(),
        })
        setProfessores((prev) => prev.map((p) => (p.id === editProf.id ? att : p)))
        setToast({ msg: `${att.nome} atualizado com sucesso!`, type: 'success' })
      } else {
        const novo = await professoresApi.criar({
          cpf: form.cpf.trim(),
          nome: form.nome.trim(),
          especialidade: form.especialidade.trim(),
          contato: form.contato.trim(),
        })
        setProfessores((prev) => [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)))
        setToast({ msg: `${novo.nome} cadastrado com sucesso!`, type: 'success' })
      }
      fechar()
    } catch (e: any) {
      setErroForm(e.message)
    } finally {
      setSalvando(false)
    }
  }

  // ---- Excluir / inativar ----
  const abrirConfirmacao = (p: ProfessorAPI) => {
    const temAulas = (p.aulas?.length ?? 0) > 0
    setAcaoConfirm(temAulas ? 'inativar' : 'excluir')
    setConfirmDel(p)
  }

  const handleConfirmarAcao = async () => {
    if (!confirmDel) return
    try {
      if (acaoConfirm === 'excluir') {
        await professoresApi.excluir(confirmDel.id)
        setProfessores((prev) => prev.filter((p) => p.id !== confirmDel.id))
        setToast({ msg: `${confirmDel.nome} excluído do sistema.`, type: 'warning' })
      } else {
        const inativado = await professoresApi.inativar(confirmDel.id)
        setProfessores((prev) => prev.map((p) => (p.id === confirmDel.id ? inativado : p)))
        setToast({ msg: `${confirmDel.nome} inativado. Os dados foram preservados.`, type: 'info' })
      }
      setConfirmDel(null)
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
      setConfirmDel(null)
    }
  }

  const handleReativar = async (p: ProfessorAPI) => {
    try {
      const reativado = await professoresApi.reativar(p.id)
      setProfessores((prev) => prev.map((x) => (x.id === p.id ? reativado : x)))
      setToast({ msg: `${p.nome} reativado com sucesso!`, type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  // ---- Render ----
  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div>
        <p className="page-eyebrow">Equipe</p>
        <h1 className="page-title">PROFESSORES</h1>
      </div>
      <SkeletonLoader rows={5} height="4rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Equipe</p>
          <h1 className="page-title">PROFESSORES</h1>
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
            {totalAtivos} ativo{totalAtivos !== 1 ? 's' : ''}
            {totalInativos > 0 && ` · ${totalInativos} inativo${totalInativos !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={abrirNovo}>
          <Plus size={16} /> Novo Professor
        </button>
      </header>

      {/* Filtros */}
      <div className="card-elevated p-3">
        <div className="row g-2">
          <div className="col-md">
            <div className="position-relative">
              <Search size={16} className="position-absolute text-muted-efc"
                style={{ top: '50%', left: 12, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" className="form-control" style={{ paddingLeft: '2.25rem' }}
                placeholder="Buscar por nome, especialidade ou CPF..."
                value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          <div className="col-md-auto">
            <div className="d-flex p-1 rounded gap-0" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              {(['todos', 'ativos', 'inativos'] as Filtro[]).map((f) => (
                <button key={f} onClick={() => setFiltro(f)}
                  className="btn btn-sm px-3"
                  style={{
                    background: filtro === f ? '#2a2a2a' : 'transparent',
                    border: 'none',
                    color: filtro === f ? '#fff' : '#a0a0a0',
                    fontSize: '0.8125rem',
                    textTransform: 'capitalize',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="card-elevated p-5 text-center">
          <Users size={40} className="text-muted-efc mb-3" />
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
            {professores.length === 0
              ? 'Nenhum professor cadastrado. Clique em "Novo Professor" para começar.'
              : 'Nenhum professor encontrado com os filtros aplicados.'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filtrados.map((p) => {
            const temAulas    = (p.aulas?.length ?? 0) > 0
            const isExpandido = expandido === p.id
            const modalidade  = getModalidade(p.especialidade)

            return (
              <div key={p.id} className="card-elevated" style={{ opacity: p.ativo ? 1 : 0.65 }}>
                {/* Linha principal */}
                <div className="p-4 d-flex align-items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="avatar-initials flex-shrink-0"
                    style={{
                      width: 48, height: 48, fontSize: '1.0625rem',
                      background: p.ativo ? 'rgba(108,127,142,.15)' : 'rgba(42,42,42,.5)',
                      color: p.ativo ? '#6c7f8e' : '#606060',
                      outline: `2px solid ${p.ativo ? '#6c7f8e' : '#2a2a2a'}`,
                      outlineOffset: 2,
                    }}
                  >
                    {p.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                  </div>

                  {/* Info principal */}
                  <div className="flex-fill min-w-0">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h3 className="font-display mb-0 text-truncate"
                        style={{ fontSize: '1.0625rem', letterSpacing: '0.03em' }}>
                        {p.nome}
                      </h3>
                      {/* Badge ativo/inativo */}
                      <span className={`badge-status ${p.ativo ? 'ativo' : 'inativo'}`}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                      {modalidade ? (
                        <BadgeModalidade modalidade={modalidade} />
                      ) : (
                        <span className="text-muted-efc" style={{ fontSize: '0.75rem' }}>
                          {p.especialidade}
                        </span>
                      )}
                      <span className="text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        {p.contato}
                      </span>
                      {temAulas && (
                        <span className="text-muted-efc" style={{ fontSize: '0.75rem' }}>
                          · {p.aulas!.length} aula{p.aulas!.length !== 1 ? 's' : ''} vinculada{p.aulas!.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    {temAulas && (
                      <button
                        className="btn btn-sm p-1 lh-1 text-muted-efc"
                        title={isExpandido ? 'Ocultar aulas' : 'Ver aulas vinculadas'}
                        onClick={() => setExpandido(isExpandido ? null : p.id)}
                      >
                        {isExpandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                    <button className="btn btn-sm p-1 lh-1 text-muted-efc"
                      title="Editar" onClick={() => abrirEditar(p)}>
                      <Pencil size={15} />
                    </button>
                    {p.ativo ? (
                      <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }}
                        title={temAulas ? 'Inativar (tem aulas vinculadas)' : 'Excluir'}
                        onClick={() => abrirConfirmacao(p)}>
                        {temAulas ? <UserX size={15} /> : <Trash2 size={15} />}
                      </button>
                    ) : (
                      <button className="btn btn-sm p-1 lh-1" style={{ color: '#4ade80' }}
                        title="Reativar" onClick={() => handleReativar(p)}>
                        <UserCheck size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Painel expandido — aulas vinculadas */}
                {isExpandido && temAulas && (
                  <div className="px-4 pb-4">
                    <div className="rounded p-3" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                      <p className="page-eyebrow mb-2">Aulas vinculadas</p>
                      <div className="d-flex flex-column gap-1">
                        {p.aulas!.map((a) => (
                          <div key={a.id}
                            className="d-flex align-items-center gap-2 py-1"
                            style={{ fontSize: '0.8125rem', borderBottom: '1px solid #1a1a1a' }}>
                            <span className="text-muted-efc" style={{ width: 24, fontSize: '0.75rem' }}>
                              #{a.id}
                            </span>
                            <span className="fw-medium">{a.turma?.nome ?? '—'}</span>
                            {a.modalidade && getModalidade(a.modalidade.nome) && (
                              <BadgeModalidade modalidade={getModalidade(a.modalidade.nome)!} />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-efc mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                        Para excluir este professor, reatribua ou remova as aulas vinculadas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal cadastro/edição */}
      {modalOpen && (
        <>
          <div onClick={fechar}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(560px,95vw)', zIndex: 1055,
          }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>
                  {editProf ? 'EDITAR PROFESSOR' : 'NOVO PROFESSOR'}
                </h5>
                <button className="btn p-1 lh-1" onClick={fechar}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && (
                  <div className="p-2 mb-3 rounded"
                    style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroForm}
                  </div>
                )}
                <div className="row g-3">
                  {!editProf && (
                    <div className="col-12">
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>CPF *</label>
                      <input type="text" className="form-control" placeholder="000.000.000-00"
                        value={form.cpf}
                        onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))} />
                    </div>
                  )}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nome completo *</label>
                    <input type="text" className="form-control"
                      value={form.nome}
                      onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Especialidade *</label>
                    <input type="text" className="form-control"
                      placeholder="Ex: Muay Thai, Jiu-Jitsu, Boxe"
                      value={form.especialidade}
                      onChange={(e) => setForm((p) => ({ ...p, especialidade: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Contato *</label>
                    <input type="text" className="form-control"
                      placeholder="(16) 99999-0000"
                      value={form.contato}
                      onChange={(e) => setForm((p) => ({ ...p, contato: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={fechar} disabled={salvando}>
                  Cancelar
                </button>
                <button className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleSalvar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />}
                  {editProf ? 'Salvar alterações' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal confirmar exclusão/inativação */}
      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(420px,95vw)', zIndex: 1055,
          }}>
            <div className="modal-content p-4 text-center">
              {acaoConfirm === 'inativar' ? (
                <UserX size={36} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
              ) : (
                <Trash2 size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
              )}

              <h5 className="font-display mb-2" style={{ letterSpacing: '0.05em' }}>
                {acaoConfirm === 'inativar' ? 'INATIVAR PROFESSOR' : 'EXCLUIR PROFESSOR'}
              </h5>

              {acaoConfirm === 'inativar' ? (
                <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                  <strong style={{ color: '#fff' }}>{confirmDel.nome}</strong> possui{' '}
                  <strong style={{ color: '#fbbf24' }}>{confirmDel.aulas!.length} aula(s) vinculada(s)</strong>{' '}
                  e não pode ser excluído. Deseja inativá-lo?
                  Os dados serão mantidos e as aulas continuarão registradas.
                </p>
              ) : (
                <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                  Excluir permanentemente{' '}
                  <strong style={{ color: '#fff' }}>{confirmDel.nome}</strong>?
                  Esta ação não pode ser desfeita.
                </p>
              )}

              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>
                  Cancelar
                </button>
                <button
                  className="btn"
                  style={
                    acaoConfirm === 'inativar'
                      ? { background: 'rgba(146,102,26,.3)', color: '#fbbf24', border: '1px solid rgba(251,191,36,.3)' }
                      : { background: 'rgba(127,29,29,.3)', color: '#f87171', border: '1px solid rgba(248,113,113,.3)' }
                  }
                  onClick={handleConfirmarAcao}
                >
                  {acaoConfirm === 'inativar' ? 'Inativar' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
