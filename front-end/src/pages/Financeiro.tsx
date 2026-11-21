import { useMemo, useState, useEffect, useCallback } from 'react'
import { Wallet, AlertTriangle, CheckCircle2, TrendingUp, Plus, X, Trash2, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { financeiroApi, alunosApi } from '../services/api'
import type { FinanceiroAPI, AlunoAPI, FormaPagamento, StatusPagamentoAPI } from '../services/api'
import StatCard from '../components/StatCard'
import Toast from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoader'

type ToastState = { msg: string; type: 'success' | 'danger' | 'warning' }

const FORMAS: FormaPagamento[] = ['Pix', 'Dinheiro', 'Cartão']
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const mesAtual = () => new Date().toISOString().slice(0, 7)
const fmtData = (d: string) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR') : '—')

const FORM_VAZIO = {
  alunoId: '', valor: '', referenciaMes: mesAtual(),
  forma: 'Pix' as FormaPagamento, status: 'aberto' as StatusPagamentoAPI,
}

export default function Financeiro() {
  const [lancamentos, setLancamentos] = useState<FinanceiroAPI[]>([])
  const [alunos, setAlunos]           = useState<AlunoAPI[]>([])
  const [loading, setLoading]         = useState(true)
  const [erro, setErro]               = useState<string | null>(null)
  const [toast, setToast]             = useState<ToastState | null>(null)
  const [modalOpen, setModalOpen]     = useState(false)
  const [form, setForm]               = useState(FORM_VAZIO)
  const [salvando, setSalvando]       = useState(false)
  const [erroForm, setErroForm]       = useState<string | null>(null)
  const [recebendo, setRecebendo]     = useState<number | null>(null)
  const [confirmDel, setConfirmDel]   = useState<FinanceiroAPI | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true); setErro(null)
    try {
      const [fs, as] = await Promise.all([financeiroApi.listar(), alunosApi.listar()])
      setLancamentos(fs); setAlunos(as)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const mes = mesAtual()
  const doMes     = lancamentos.filter((l) => l.referenciaMes === mes)
  const pagos     = doMes.filter((l) => l.status === 'pago')
  const pendentes = doMes.filter((l) => l.status !== 'pago')
  const recebido  = pagos.reduce((s, l) => s + l.valor, 0)
  const aReceber  = pendentes.reduce((s, l) => s + l.valor, 0)

  const receita6m = useMemo(() => {
    const out: { mes: string; valor: number }[] = []
    const base = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1)
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const valor = lancamentos
        .filter((l) => l.status === 'pago' && l.referenciaMes === chave)
        .reduce((s, l) => s + l.valor, 0)
      out.push({ mes: MESES[d.getMonth()], valor })
    }
    return out
  }, [lancamentos])

  const ultimos = useMemo(
    () => lancamentos
      .filter((l) => l.status === 'pago')
      .sort((a, b) => b.dataPagamento.localeCompare(a.dataPagamento) || b.id - a.id)
      .slice(0, 8),
    [lancamentos],
  )

  const nomeAluno = (l: FinanceiroAPI) =>
    l.aluno?.nome ?? alunos.find((a) => a.id === l.alunoId)?.nome ?? `Aluno #${l.alunoId}`

  const abrirNovo = () => { setForm({ ...FORM_VAZIO, referenciaMes: mesAtual() }); setErroForm(null); setModalOpen(true) }

  const onSelecionarAluno = (id: string) => {
    const a = alunos.find((x) => String(x.id) === id)
    setForm((p) => ({ ...p, alunoId: id, valor: a && !p.valor ? String(a.valorMensalidade) : p.valor }))
  }

  const handleSalvar = async () => {
    if (!form.alunoId) { setErroForm('Selecione o aluno.'); return }
    const valor = Number(form.valor)
    if (!valor || valor <= 0) { setErroForm('Informe um valor maior que zero.'); return }
    if (!/^\d{4}-\d{2}$/.test(form.referenciaMes)) { setErroForm('Informe o mês de referência.'); return }
    setSalvando(true); setErroForm(null)
    try {
      const novo = await financeiroApi.criar({
        alunoId: Number(form.alunoId), valor,
        referenciaMes: form.referenciaMes, forma: form.forma, status: form.status,
      })
      setLancamentos((prev) => [novo, ...prev])
      setModalOpen(false)
      setToast({ msg: 'Lançamento registrado!', type: 'success' })
    } catch (e: any) {
      setErroForm(e.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleReceber = async (l: FinanceiroAPI) => {
    setRecebendo(l.id)
    try {
      const att = await financeiroApi.pagar(l.id)
      setLancamentos((prev) => prev.map((x) => (x.id === l.id ? att : x)))
      setToast({ msg: `Pagamento de ${nomeAluno(l)} registrado.`, type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    } finally {
      setRecebendo(null)
    }
  }

  const handleExcluir = async (l: FinanceiroAPI) => {
    try {
      await financeiroApi.excluir(l.id)
      setLancamentos((prev) => prev.filter((x) => x.id !== l.id))
      setToast({ msg: 'Lançamento excluído.', type: 'warning' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'danger' })
    } finally {
      setConfirmDel(null)
    }
  }

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Gestão</p><h1 className="page-title">FINANCEIRO</h1></div>
      <SkeletonLoader rows={5} height="4rem" />
    </div>
  )

  const errBox = { background: 'rgba(127,29,29,.2)', border: '1px solid rgba(248,113,113,.3)', color: '#f87171', fontSize: '0.8125rem' }

  return (
    <div className="d-flex flex-column gap-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Gestão</p>
          <h1 className="page-title">FINANCEIRO</h1>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={abrirNovo}>
          <Plus size={16} /> Novo lançamento
        </button>
      </header>

      {erro && <div className="p-3 rounded" style={errBox}>{erro}</div>}

      <div className="row g-3">
        <div className="col-sm-6 col-xl-3"><StatCard icon={Wallet} label="Previsto no mês" value={recebido + aReceber} prefix="R$ " /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={CheckCircle2} label="Recebido" value={recebido} prefix="R$ " variant="success" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={AlertTriangle} label="A receber" value={aReceber} prefix="R$ " variant="warning" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={TrendingUp} label="Pendentes" value={pendentes.length} variant="danger" /></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card-elevated p-4 h-100">
            <h3 className="font-display mb-4" style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>RECEITA — 6 MESES</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={receita6m} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="mes" stroke="#606060" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606060" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12, color: '#fff' }} />
                <Line type="monotone" dataKey="valor" stroke="#6c7f8e" strokeWidth={2.5} dot={{ r: 4, fill: '#6c7f8e' }} name="Receita (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-elevated p-4 h-100">
            <h3 className="font-display mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
              <AlertTriangle size={16} style={{ color: '#f87171' }} /> PENDÊNCIAS
            </h3>
            {pendentes.length === 0 ? (
              <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>Nenhuma pendência neste mês.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendentes.map((l) => (
                  <div key={l.id} className="d-flex align-items-center justify-content-between gap-2 p-3 rounded"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div className="min-w-0">
                      <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>{nomeAluno(l)}</p>
                      <p className="mb-0 pulse-dot" style={{ fontSize: '0.75rem', color: l.status === 'atrasado' ? '#f87171' : '#fbbf24' }}>
                        R$ {l.valor} {l.status === 'atrasado' ? 'em atraso' : 'em aberto'}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-primary flex-shrink-0 d-flex align-items-center gap-1"
                      onClick={() => handleReceber(l)} disabled={recebendo === l.id}>
                      {recebendo === l.id && <Loader2 size={12} className="spin" />} Receber
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-elevated p-4">
        <h3 className="font-display mb-3" style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>ÚLTIMOS PAGAMENTOS</h3>
        {ultimos.length === 0 ? (
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>Nenhum pagamento registrado.</p>
        ) : (
          <div className="d-flex flex-column">
            {ultimos.map((l, i) => (
              <div key={l.id} className="d-flex align-items-center justify-content-between py-3"
                style={{ borderBottom: i < ultimos.length - 1 ? '1px solid #1a1a1a' : 'none', fontSize: '0.875rem' }}>
                <div>
                  <p className="mb-0 fw-medium">{nomeAluno(l)}</p>
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                    {l.forma} · {fmtData(l.dataPagamento)} · ref. {l.referenciaMes}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="font-display" style={{ fontSize: '1.25rem', color: '#4ade80' }}>R$ {l.valor}</span>
                  <button className="btn btn-sm p-1 lh-1" style={{ color: '#f87171' }} title="Excluir lançamento"
                    onClick={() => setConfirmDel(l)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <>
          <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(520px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>NOVO LANÇAMENTO</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <div className="modal-body px-4 py-3">
                {erroForm && <div className="p-2 mb-3 rounded" style={errBox}>{erroForm}</div>}
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Aluno *</label>
                    <select className="form-select" value={form.alunoId} onChange={(e) => onSelecionarAluno(e.target.value)}>
                      <option value="">Selecione o aluno</option>
                      {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Valor (R$) *</label>
                    <input type="number" min={0} step="0.01" className="form-control"
                      value={form.valor} onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Mês de referência *</label>
                    <input type="month" className="form-control"
                      value={form.referenciaMes} onChange={(e) => setForm((p) => ({ ...p, referenciaMes: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Forma</label>
                    <select className="form-select" value={form.forma}
                      onChange={(e) => setForm((p) => ({ ...p, forma: e.target.value as FormaPagamento }))}>
                      {FORMAS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>Situação</label>
                    <select className="form-select" value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as StatusPagamentoAPI }))}>
                      <option value="aberto">Em aberto</option>
                      <option value="atrasado">Atrasado</option>
                      <option value="pago">Pago</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={salvando}>Cancelar</button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSalvar} disabled={salvando}>
                  {salvando && <Loader2 size={14} className="spin" />} Registrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(400px,95vw)', zIndex: 1055 }}>
            <div className="modal-content p-4 text-center">
              <Trash2 size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
              <h5 className="font-display mb-2">EXCLUIR LANÇAMENTO</h5>
              <p className="text-muted-efc mb-4" style={{ fontSize: '0.875rem' }}>
                Excluir o lançamento de <strong style={{ color: '#fff' }}>{nomeAluno(confirmDel)}</strong> (R$ {confirmDel.valor}, ref. {confirmDel.referenciaMes})?
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
