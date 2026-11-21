import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useMemo } from 'react'
import type { PresencaAPI } from '../services/api'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface Props {
  // Quando não passado, exibe zeros (estado vazio)
  presencas?: PresencaAPI[]
}

export default function GraficoFrequencia({ presencas = [] }: Props) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    DIAS.forEach((d) => { counts[d] = 0 })

    // últimos 7 dias
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso   = d.toISOString().slice(0, 10)
      const label = DIAS[d.getDay()]
      counts[label] = (counts[label] || 0) +
        presencas.filter((p) => new Date(p.data).toISOString().slice(0, 10) === iso).length
    }

    return DIAS.map((d) => ({ dia: d, checkins: counts[d] }))
  }, [presencas])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="dia" stroke="#606060" tick={{ fontSize: 11 }} />
        <YAxis stroke="#606060" tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12, color: '#fff' }}
          cursor={{ fill: 'rgba(108,127,142,.08)' }}
        />
        <Bar dataKey="checkins" fill="#6c7f8e" radius={[4, 4, 0, 0]} name="Check-ins" />
      </BarChart>
    </ResponsiveContainer>
  )
}
