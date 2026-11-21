import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, Plus, X, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useAlunos } from '../hooks/useAlunos'
import { alunoFromAPI, alunoToAPI, statusToAPI } from '../services/mappers'
import type { Aluno, Modalidade, Faixa, StatusAluno } from '../types'
import AlunoCard from '../components/AlunoCard'
import OffcanvasPerfil from '../components/OffcanvasPerfil'
import BadgeModalidade from '../components/BadgeModalidade'
import FaixaBadge from '../components/FaixaBadge'
import StatusBadge from '../components/StatusBadge'
import SkeletonLoader from '../components/SkeletonLoader'
import Toast from '../components/Toast'

const MODALIDADES: Modalidade[] = ['Boxe', 'Muay Thai', 'Jiu-Jitsu', 'Funcional']
const FAIXAS: Faixa[] = ['Iniciante', 'Intermediário', 'Branca', 'Azul', 'Roxa', 'Marrom', 'Preta', 'N/A']
const STATUS_OPTS: StatusAluno[] = ['Ativo', 'Inadimplente', 'Inativo']

const FORM_VAZIO = {
  cpf: '', nome: '', idade: '', peso: '', altura: '', mensalidade: '150',
  modalidade: 'Muay Thai' as Modalidade, faixa: 'Iniciante' as Faixa,
  status: 'Ativo' as StatusAluno, email: '', telefone: '',
}

interface Toast { msg: string; type: 'success' | 'danger' | 'warning' }

export default function Alunos() {
  const { alunos: alunosAPI, loading, erro, criar, atualizar, excluir } = useAlunos()
  const alunos = useMemo(() => alunosAPI.map(alunoFromAPI), [alunosAPI])

  const [view, setView]           = useState<'cards' | 'table'>('cards')
  const [busca, setBusca]         = useState('')
  const [filtroMod, setFiltroMod] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [perfilId, setPerfilId]   = useState<string | null>(null)

  const [modalOpen, setModalOpen]   = useState(false)
  const [editAluno, setEditAluno]   = useState<Aluno | null>(null)
  const [form, setForm]             = useState(FORM_VAZIO)
  const [salvando, setSalvando]     = useState(false)
  const [erroForm, setErroForm]     = useState<string | null>(null)
  const [toast, setToast]           = useState<Toast | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Aluno | null>(null)

  const filtrados = useMemo(
    () => alunos.filter((a) => {
      if (busca && !a.nome.toLowerCase().includes(busca.toLowerCase())) return false
      if (filtroMod !== 'todos' && !a.modalidades.includes(filtroMod as Modalidade)) return false
      if (filtroStatus !== 'todos' && a.status !== filtroStatus) return false
      return true
    }),
    [alunos, busca, filtroMod, filtroStatus],
  )

  const perfilAluno = alunos.find((a) => a.id === perfilId) ?? null

  const abrirNovo = () => {
    setEditAluno(null)
    setForm(FORM_VAZIO)
    setErroForm(null)
    setModalOpen(true)
  }

  const abrirEditar = (a: Aluno) => {
    setEditAluno(a)
    setForm({
      cpf: '', nome: a.nome, idade: String(a.idade), peso: String(a.peso),
      altura: String(a.altura), mensalidade: String(a.mensalidade),
      modalidade: a.modalidades[0] ?? 'Muay Thai',
      faixa: a.faixa, status: a.status,
      email: a.email, telefone: a.telefone,
    })
    setErroForm(null)
    setModalOpen(true)
  }

  const fecharModal = () => { setModalOpen(false); setEditAluno(null) }

  const handleSalvar = async () => {
    if (!form.nome.trim()) { setErroForm('Nome é obrigatório.'); return }
    if (!editAluno && !form.cpf.trim()) { setErroForm('CPF é obrigatório.'); return }

    setSalvando(true)
    setErroForm(null)
    try {
      if (editAluno) {
        const id = Number(editAluno.id)
        await atualizar(id, {
          nome: form.nome, idade: Number(form.idade), peso: Number(form.peso),
          altura: Number(form.altura), valorMensalidade: Number(form.mensalidade),
          graduacao: form.faixa, email: form.email, telefone: form.telefone,
          status: statusToAPI(form.status), modalidades: [form.modalidade],
        })
        setToast({ msg: 'Aluno atualizado com sucesso!', type: 'success' })
      } else {
        await criar({
          cpf: form.cpf, nome: form.nome, idade: Number(form.idade),
          peso: Number(form.peso), altura: Number(form.altura),
          valorMensalidade: Number(form.mensalidade), graduacao: form.faixa,
          email: form.email, telefone: form.telefone,
          status: statusToAPI(form.status), modalidades: [form.modalidade],
          streak: 0,
          dataMatricula: new Date().toISOString().slice(0, 10),
        })
        setToast({ msg: 'Aluno cadastrado com sucesso!', type: 'success' })
      }
      fecharModal()
    } catch (e: any) {
      setErroForm(e.message ?? 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async (a: Aluno) => {
    try {
      await excluir(Number(a.id))
      setConfirmDelete(null)
      setToast({ msg: `${a.nome} excluído.`, type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message ?? 'Erro ao excluir', type: 'danger' })
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Cadastro</p><h1 className="page-title">ALUNOS</h1></div>
      <SkeletonLoader rows={6} height="4rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Cadastro</p>
          <h1 className="page-title">ALUNOS</h1>
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
            {filtrados.length} de {alunos.length}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex p-1 rounded" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <button className={`btn btn-sm p-1 lh-1 ${view === 'cards' ? 'text-white' : 'text-muted-efc'}`}
              style={{ background: view === 'cards' ? '#2a2a2a' : 'transparent', border: 'none' }}
              onClick={() => setView('cards')} aria-label="Cards">
              <LayoutGrid size={16} />
            </button>
            <button className={`btn btn-sm p-1 lh-1 ${view === 'table' ? 'text-white' : 'text-muted-efc'}`}
              style={{ background: view === 'table' ? '#2a2a2a' : 'transparent', border: 'none' }}
              onClick={() => setView('table')} aria-label="Tabela">
              <List size={16} />
            </button>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={abrirNovo}>
            <Plus size={16} /> Novo
          </button>
        </div>
      </header>

      {erro && (
        <div className="p-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.875rem' }}>
          {erro}
        </div>
      )}

      {/* Filtros */}
      <div className="card-elevated p-3">
        <div className="row g-2">
          <div className="col-md">
            <div className="position-relative">
              <Search size={16} className="position-absolute text-muted-efc"
                style={{ top: '50%', left: 12, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" className="form-control" style={{ paddingLeft: '2.25rem' }}
                placeholder="Buscar aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filtroMod} onChange={(e) => setFiltroMod(e.target.value)}>
              <option value="todos">Todas modalidades</option>
              {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="todos">Todos status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inadimplente">Inadimplente</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      {view === 'cards' && (
        <div className="row g-3">
          {filtrados.map((a) => (
            <div key={a.id} className="col-sm-6 col-xl-4">
              <AlunoCard aluno={a} onClick={() => setPerfilId(a.id)} />
            </div>
          ))}
          {filtrados.length === 0 && !loading && (
            <div className="col-12 text-center text-muted-efc py-5">
              {alunos.length === 0 ? 'Nenhum aluno cadastrado.' : 'Nenhum aluno encontrado.'}
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      {view === 'table' && (
        <div className="card-elevated" style={{ overflowX: 'auto' }}>
          <table className="table table-efc mb-0">
            <thead>
              <tr>
                <th>Nome</th><th>CPF</th><th>Modalidades</th>
                <th>Faixa</th><th className="text-end">Mensalidade</th>
                <th>Status</th><th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a) => (
                <tr key={a.id} onClick={() => setPerfilId(a.id)} style={{ cursor: 'pointer' }}>
                  <td className="fw-medium">{a.nome}</td>
                  <td className="text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    {alunosAPI.find((x) => String(x.id) === a.id)?.cpf ?? '—'}
                  </td>
                  <td><div className="d-flex flex-wrap gap-1">
                    {a.modalidades.map((m) => <BadgeModalidade key={m} modalidade={m} />)}
                  </div></td>
                  <td><FaixaBadge faixa={a.faixa} showBar={false} /></td>
                  <td className="text-end">R$ {a.mensalidade}</td>
                  <td><StatusBadge status={a.status === 'Ativo' ? 'ativo' : a.status === 'Inadimplente' ? 'inadimplente' : 'inativo'} /></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm p-1 lh-1 text-muted-efc" title="Editar"
                        onClick={() => abrirEditar(a)}><Pencil size={14} /></button>
                      <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }} title="Excluir"
                        onClick={() => setConfirmDelete(a)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offcanvas Perfil */}
      <OffcanvasPerfil aluno={perfilAluno} show={!!perfilId} onHide={() => setPerfilId(null)} />

      {/* Modal Novo/Editar Aluno */}
      {modalOpen && (
        <>
          <div onClick={fecharModal}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(600px, 95vw)', maxHeight: '90vh', overflowY: 'auto', zIndex: 1055,
          }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>
                  {editAluno ? 'EDITAR ALUNO' : 'NOVO ALUNO'}
                </h5>
                <button className="btn p-1 lh-1" onClick={fecharModal}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && (
                  <div className="p-2 mb-3 rounded" style={{ background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }}>
                    {erroForm}
                  </div>
                )}
                <div className="row g-3">
                  {!editAluno && (
                    <div className="col-sm-6">
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>CPF *</label>
                      <input type="text" className="form-control" placeholder="000.000.000-00"
                        value={form.cpf} onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))} />
                    </div>
                  )}
                  <div className={editAluno ? 'col-12' : 'col-sm-6'}>
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nome *</label>
                    <input type="text" className="form-control"
                      value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                  </div>
                  {[
                    { label: 'Idade', key: 'idade', type: 'number' },
                    { label: 'Peso (kg)', key: 'peso', type: 'number' },
                    { label: 'Altura (m)', key: 'altura', type: 'number' },
                    { label: 'Mensalidade (R$)', key: 'mensalidade', type: 'number' },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="col-sm-6">
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>{label}</label>
                      <input type={type} className="form-control"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>E-mail</label>
                    <input type="email" className="form-control"
                      value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Telefone</label>
                    <input type="text" className="form-control"
                      value={form.telefone} onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Modalidade</label>
                    <select className="form-select" value={form.modalidade}
                      onChange={(e) => setForm((p) => ({ ...p, modalidade: e.target.value as Modalidade }))}>
                      {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Graduação / Faixa</label>
                    <select className="form-select" value={form.faixa}
                      onChange={(e) => setForm((p) => ({ ...p, faixa: e.target.value as Faixa }))}>
                      {FAIXAS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Status</label>
                    <select className="form-select" value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as StatusAluno }))}>
                      {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={fecharModal} disabled={salvando}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSalvar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />}
                  {editAluno ? 'Salvar alterações' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal confirmar exclusão */}
      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 'min(400px, 95vw)', zIndex: 1055,
          }}>
            <div className="modal-content p-4 text-center">
              <Trash2 size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
              <h5 className="font-display mb-2" style={{ letterSpacing: '0.05em' }}>CONFIRMAR EXCLUSÃO</h5>
              <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                Excluir <strong style={{ color: '#fff' }}>{confirmDelete.nome}</strong>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="btn" style={{ background: 'rgba(127,29,29,.3)', color: '#f87171', border: '1px solid rgba(248,113,113,.3)' }}
                  onClick={() => handleExcluir(confirmDelete)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
