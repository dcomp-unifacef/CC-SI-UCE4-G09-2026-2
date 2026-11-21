import { useMemo, useState } from 'react'
import { ScanLine, Clock, Camera, X } from 'lucide-react'
import { alunosMock, frequenciasMock } from '../data/mockData'
import type { Frequencia as FreqType, Modalidade } from '../types'
import BadgeModalidade from '../components/BadgeModalidade'

const MODALIDADES: Modalidade[] = ['Boxe', 'Muay Thai', 'Jiu-Jitsu', 'Funcional']

export default function Frequencia() {
  const [frequencias, setFrequencias] = useState<FreqType[]>(frequenciasMock)
  const [modalOpen, setModalOpen]     = useState(false)
  const [alunoSel, setAlunoSel]       = useState('')
  const [modSel, setModSel]           = useState<Modalidade>('Muay Thai')

  const today = new Date().toISOString().slice(0, 10)

  const hoje = useMemo(
    () =>
      frequencias
        .filter((f) => f.data === today)
        .sort((a, b) => b.hora.localeCompare(a.hora)),
    [frequencias, today],
  )

  const registrar = () => {
    if (!alunoSel) return
    const aluno = alunosMock.find((a) => a.id === alunoSel)
    if (!aluno) return
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setFrequencias((prev) => [
      ...prev,
      {
        id: `f${Date.now()}`,
        alunoId: alunoSel,
        data: today,
        hora,
        modalidade: modSel,
      },
    ])
    setModalOpen(false)
    setAlunoSel('')
  }

  return (
    <div className="d-flex flex-column gap-4">
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Controle</p>
          <h1 className="page-title">FREQUÊNCIA</h1>
          <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
            {hoje.length} check-ins hoje
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <ScanLine size={18} /> Registrar entrada
        </button>
      </header>

      <div className="card-elevated p-4">
        <h3
          className="font-display mb-3"
          style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
        >
          CHECK-INS DE HOJE
        </h3>

        {hoje.length === 0 ? (
          <p className="text-center text-muted-efc py-4" style={{ fontSize: '0.875rem' }}>
            Nenhum check-in registrado hoje.
          </p>
        ) : (
          <div className="row g-2">
            {hoje.map((f) => {
              const aluno = alunosMock.find((a) => a.id === f.alunoId)
              const initials = aluno?.nome.split(' ').slice(0, 2).map((n) => n[0]).join('') ?? ''
              return (
                <div key={f.id} className="col-sm-6 col-lg-4">
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  >
                    <div className="avatar-initials flex-shrink-0" style={{ width: 40, height: 40 }}>
                      {initials}
                    </div>
                    <div className="flex-fill min-w-0">
                      <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                        {aluno?.nome ?? '—'}
                      </p>
                      <BadgeModalidade modalidade={f.modalidade} />
                    </div>
                    <span
                      className="d-flex align-items-center gap-1 text-muted-efc flex-shrink-0"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Clock size={12} /> {f.hora}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal registrar */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }}
          />
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 'min(440px, 95vw)',
              zIndex: 1055,
            }}
          >
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>REGISTRAR ENTRADA</h5>
                <button className="btn p-1 lh-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>

              <div className="modal-body px-4 py-4 d-flex flex-column gap-3">
                {/* Simulação câmera */}
                <div className="d-flex justify-content-center py-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 96, height: 96,
                      border: '1px dashed rgba(108,127,142,.4)',
                      background: '#111111',
                      color: '#6c7f8e',
                    }}
                  >
                    <Camera size={40} />
                  </div>
                </div>
                <p className="text-center text-muted-efc mb-0" style={{ fontSize: '0.75rem' }}>
                  Câmera simulada · foto opcional
                </p>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Aluno</label>
                  <select
                    className="form-select"
                    value={alunoSel}
                    onChange={(e) => setAlunoSel(e.target.value)}
                  >
                    <option value="">Selecione o aluno</option>
                    {alunosMock.map((a) => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Modalidade</label>
                  <select
                    className="form-select"
                    value={modSel}
                    onChange={(e) => setModSel(e.target.value as Modalidade)}
                  >
                    {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-footer px-4 py-3">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={registrar} disabled={!alunoSel}>
                  Confirmar check-in
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
