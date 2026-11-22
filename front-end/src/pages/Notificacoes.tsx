import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCircle2, CheckCheck, Plus, X, Trash2, Loader2 } from 'lucide-react'
import { notificacoesApi, alunosApi, alunoMeApi } from '../services/api'
import type { NotificacaoAPI, AlunoAPI, TipoNotificacao } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'

type ToastState = { msg: string; type: 'success' | 'danger' | 'warning' }

const tipoStyle: Record<TipoNotificacao, { bg: string; color: string; border: string; label: string }> = {
  info:    { bg: 'rgba(108,127,142,.1)', color: '#8a9dac', border: 'rgba(108,127,142,.3)', label: 'Informação' },
  warning: { bg: 'rgba(146,102,26,.1)',  color: '#fbbf24', border: 'rgba(146,102,26,.3)',  label: 'Aviso' },
  danger:  { bg: 'rgba(127,29,29,.1)',   color: '#f87171', border: 'rgba(127,29,29,.3)',   label: 'Urgente' },
  success: { bg: 'rgba(45,106,79,.1)',   color: '#4ade80', border: 'rgba(45,106,79,.3)',   label: 'Sucesso' },
}

const estiloTipo = (t: string) => tipoStyle[t as TipoNotificacao] ?? tipoStyle.info
const FORM_VAZIO = { alunoId: '', tipoNotificacao: 'info' as TipoNotificacao, mensagem: '' }

export default function Notificacoes() {
  const { isAdmin, isAluno } = useAuth()
  const [notificacoes, setNotificacoes] = useState<NotificacaoAPI[]>([])
  const [alunos, setAlunos]             = useState<AlunoAPI[]>([])
  const [loading, setLoading]           = useState(true)
  const [erro, setErro]                 = useState<string | null>(null)
  const [toast, setToast]               = useState<ToastState | null>(null)
  const [modalOpen, setModalOpen]       = useState(false)
  const [form, setForm]                 = useState(FORM_VAZIO)
  const [salvando, setSalvando]         = useState(false)
  const [erroForm, setErroForm]         = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true); setErro(null)
    try {
      if (isAdmin) {
        const [ns, as] = await Promise.all([notificacoesApi.listar(), alunosApi.listar()])
        setNotificacoes(ns); setAlunos(as)
      } else if (isAluno) {
        const ns = await alunoMeApi.obterNotificacoes()
        setNotificacoes(ns)
      }
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }, [isAdmin, isAluno])

  useEffect(() => { carregar() }, [carregar])

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const handleMarcarLida = async (n: NotificacaoAPI) => {
    try {
      let att: NotificacaoAPI
      if (isAdmin) {
        att = await notificacoesApi.marcarLida(n.id)
      } else {
        att = await alunoMeApi.marcarNotificacaoLida(n.id)
      }
      setNotificacoes((prev) => prev.map((x) => (x.id === n.id ? att : x)))
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  const handleMarcarTodas = async () => {
    try {
      if (isAdmin) {
        await notificacoesApi.marcarTodasLidas()
      } else {
        await alunoMeApi.marcarTodasNotificacoesLidas()
      }
      setNotificacoes((prev) => prev.map((x) => ({ ...x, lida: true })))
      setToast({ msg: 'Todas marcadas como lidas.', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  const handleExcluir = async (n: NotificacaoAPI) => {
    try {
      await notificacoesApi.excluir(n.id)
      setNotificacoes((prev) => prev.filter((x) => x.id !== n.id))
      setToast({ msg: 'Notificação excluída.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    }
  }

  const handleCriar = async () => {
    if (!form.alunoId) { setErroForm('Selecione o aluno.'); return }
    if (!form.mensagem.trim()) { setErroForm('Escreva a mensagem.'); return }
    setSalvando(true); setErroForm(null)
    try {
      const nova = await notificacoesApi.criar({
        alunoId: Number(form.alunoId),
        tipoNotificacao: form.tipoNotificacao,
        mensagem: form.mensagem.trim(),
      })
      setNotificacoes((prev) => [nova, ...prev])
      setModalOpen(false); setForm(FORM_VAZIO)
      setToast({ msg: 'Notificação enviada!', type: 'success' })
    } catch (e: any) {
      setErroForm(e.message)
    } finally {
      setSalvando(false)
    }
  }

  const errBox = { background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Central</p><h1 className="page-title">NOTIFICAÇÕES</h1></div>
      <SkeletonLoader rows={4} height="4.5rem" />
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Central</p>
          <h1 className="page-title">NOTIFICAÇÕES</h1>
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
            {naoLidas} não lida{naoLidas !== 1 ? 's' : ''} · {notificacoes.length} no total
          </p>
        </div>
        {isAdmin && (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={handleMarcarTodas} disabled={naoLidas === 0}>
              <CheckCheck size={16} /> Marcar todas como lidas
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => { setForm(FORM_VAZIO); setErroForm(null); setModalOpen(true) }}>
              <Plus size={16} /> Nova notificação
            </button>
          </div>
        )}
        {isAluno && (
          <button className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={handleMarcarTodas} disabled={naoLidas === 0}>
            <CheckCheck size={16} /> Marcar todas como lidas
          </button>
        )}
      </header>

      {erro && <div className="p-3 rounded" style={errBox}>{erro}</div>}

      <div className="d-flex flex-column gap-3">
        {notificacoes.length === 0 && (
          <div className="card-elevated p-5 text-center text-muted-efc" style={{ fontSize: '0.875rem' }}>
            Nenhuma notificação.
          </div>
        )}

        {notificacoes.map((n) => {
          const s = estiloTipo(n.tipoNotificacao)
          return (
            <div key={n.id} className="card-elevated p-4" style={{ opacity: n.lida ? 0.75 : 1 }}>
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded"
                    style={{ width: 36, height: 36, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="mb-1 fw-medium d-flex align-items-center gap-2" style={{ fontSize: '0.9375rem' }}>
                      {isAdmin && (n.aluno?.nome ?? `Aluno #${n.alunoId}`)}
                      <span style={{ fontSize: '0.6875rem', color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {s.label}
                      </span>
                      {!n.lida && (
                        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#6c7f8e' }} />
                      )}
                    </p>
                    <p className="mb-1 text-muted-efc" style={{ fontSize: '0.875rem' }}>{n.mensagem}</p>
                    <p className="mb-0 text-muted-efc" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {new Date(n.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-1 flex-shrink-0">
                  {!n.lida && (
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() => handleMarcarLida(n)}>
                      <CheckCircle2 size={14} /> Marcar lida
                    </button>
                  )}
                  {isAdmin && (
                    <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }} title="Excluir"
                      onClick={() => handleExcluir(n)}><Trash2 size={15} /></button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <>
          <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(520px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>NOVA NOTIFICAÇÃO</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && <div className="p-2 mb-3 rounded" style={errBox}>{erroForm}</div>}
                <div className="row g-3">
                  <div className="col-sm-7">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Aluno *</label>
                    <select className="form-select" value={form.alunoId}
                      onChange={(e) => setForm((p) => ({ ...p, alunoId: e.target.value }))}>
                      <option value="">Selecione o aluno</option>
                      {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Tipo</label>
                    <select className="form-select" value={form.tipoNotificacao}
                      onChange={(e) => setForm((p) => ({ ...p, tipoNotificacao: e.target.value as TipoNotificacao }))}>
                      {(Object.keys(tipoStyle) as TipoNotificacao[]).map((t) => (
                        <option key={t} value={t}>{tipoStyle[t].label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Mensagem *</label>
                    <textarea className="form-control" rows={3} value={form.mensagem}
                      onChange={(e) => setForm((p) => ({ ...p, mensagem: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={salvando}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCriar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />} Enviar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
