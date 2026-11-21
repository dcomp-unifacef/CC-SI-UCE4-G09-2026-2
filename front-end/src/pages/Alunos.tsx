import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, Plus, X } from 'lucide-react'
import { alunosMock } from '../data/mockData'
import type { Aluno, Modalidade } from '../types'
import AlunoCard from '../components/AlunoCard'
import OffcanvasPerfil from '../components/OffcanvasPerfil'
import BadgeModalidade from '../components/BadgeModalidade'
import FaixaBadge from '../components/FaixaBadge'
import StatusBadge from '../components/StatusBadge'

const MODALIDADES: Modalidade[] = ['Boxe', 'Muay Thai', 'Jiu-Jitsu', 'Funcional']

export default function Alunos() {
  const [alunos, setAlunos]       = useState<Aluno[]>(alunosMock)
  const [view, setView]           = useState<'cards' | 'table'>('cards')
  const [busca, setBusca]         = useState('')
  const [filtroMod, setFiltroMod] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [perfilId, setPerfilId]   = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Novo aluno form
  const [form, setForm] = useState({
    nome: '', idade: '', peso: '', altura: '', mensalidade: '150', modalidade: 'Muay Thai' as Modalidade,
  })

  const filtrados = useMemo(
    () =>
      alunos.filter((a) => {
        if (busca && !a.nome.toLowerCase().includes(busca.toLowerCase())) return false
        if (filtroMod !== 'todos' && !a.modalidades.includes(filtroMod as Modalidade)) return false
        if (filtroStatus !== 'todos' && a.status !== filtroStatus) return false
        return true
      }),
    [alunos, busca, filtroMod, filtroStatus],
  )

  const perfilAluno = alunos.find((a) => a.id === perfilId) ?? null

  const handleNovoAluno = () => {
    if (!form.nome) return
    const novo: Aluno = {
      id: `a${Date.now()}`,
      nome: form.nome,
      idade: Number(form.idade) || 0,
      peso: Number(form.peso) || 0,
      altura: Number(form.altura) || 0,
      modalidades: [form.modalidade],
      faixa: 'Iniciante',
      mensalidade: Number(form.mensalidade) || 150,
      status: 'Ativo',
      email: `${form.nome.toLowerCase().split(' ')[0]}@efc.com`,
      telefone: '(16) 99999-0000',
      dataMatricula: new Date().toISOString().slice(0, 10),
      streak: 0,
    }
    setAlunos((prev) => [...prev, novo])
    setForm({ nome: '', idade: '', peso: '', altura: '', mensalidade: '150', modalidade: 'Muay Thai' })
    setModalOpen(false)
  }

  return (
    <div className="d-flex flex-column gap-4">
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
          {/* Toggle view */}
          <div
            className="d-flex p-1 rounded"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <button
              className={`btn btn-sm p-1 lh-1 ${view === 'cards' ? 'text-white' : 'text-muted-efc'}`}
              style={{ background: view === 'cards' ? '#2a2a2a' : 'transparent', border: 'none' }}
              onClick={() => setView('cards')}
              aria-label="Visualização em cards"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`btn btn-sm p-1 lh-1 ${view === 'table' ? 'text-white' : 'text-muted-efc'}`}
              style={{ background: view === 'table' ? '#2a2a2a' : 'transparent', border: 'none' }}
              onClick={() => setView('table')}
              aria-label="Visualização em tabela"
            >
              <List size={16} />
            </button>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} /> Novo
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="card-elevated p-3">
        <div className="row g-2">
          <div className="col-md">
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute text-muted-efc"
                style={{ top: '50%', left: 12, transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Buscar aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtroMod}
              onChange={(e) => setFiltroMod(e.target.value)}
            >
              <option value="todos">Todas modalidades</option>
              {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
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
          {filtrados.length === 0 && (
            <div className="col-12 text-center text-muted-efc py-5">Nenhum aluno encontrado.</div>
          )}
        </div>
      )}

      {/* Tabela */}
      {view === 'table' && (
        <div className="card-elevated" style={{ overflowX: 'auto' }}>
          <table className="table table-efc mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Modalidades</th>
                <th>Faixa</th>
                <th className="text-end">Mensalidade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a) => (
                <tr key={a.id} onClick={() => setPerfilId(a.id)}>
                  <td className="fw-medium">{a.nome}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {a.modalidades.map((m) => <BadgeModalidade key={m} modalidade={m} />)}
                    </div>
                  </td>
                  <td><FaixaBadge faixa={a.faixa} showBar={false} /></td>
                  <td className="text-end">R$ {a.mensalidade}</td>
                  <td>
                    <StatusBadge
                      status={
                        a.status === 'Ativo' ? 'ativo'
                        : a.status === 'Inadimplente' ? 'inadimplente'
                        : 'inativo'
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offcanvas Perfil */}
      <OffcanvasPerfil
        aluno={perfilAluno}
        show={!!perfilId}
        onHide={() => setPerfilId(null)}
      />

      {/* Modal Novo Aluno */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }}
          />
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 'min(560px, 95vw)',
              zIndex: 1055,
            }}
          >
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>NOVO ALUNO</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                <div className="row g-3">
                  {[
                    { label: 'Nome',         key: 'nome',        type: 'text' },
                    { label: 'Idade',        key: 'idade',       type: 'number' },
                    { label: 'Peso (kg)',    key: 'peso',        type: 'number' },
                    { label: 'Altura (m)',   key: 'altura',      type: 'number' },
                    { label: 'Mensalidade', key: 'mensalidade', type: 'number' },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="col-sm-6">
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>{label}</label>
                      <input
                        type={type}
                        className="form-control"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Modalidade</label>
                    <select
                      className="form-select"
                      value={form.modalidade}
                      onChange={(e) => setForm((p) => ({ ...p, modalidade: e.target.value as Modalidade }))}
                    >
                      {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleNovoAluno}>Cadastrar</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
