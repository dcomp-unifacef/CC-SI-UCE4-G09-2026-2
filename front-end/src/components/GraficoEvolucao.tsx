import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot,
} from 'recharts'
import { medicoesMock } from '../data/mockData'

interface Props { alunoId: string }

export default function GraficoEvolucao({ alunoId }: Props) {
  const data = (medicoesMock[alunoId] ?? []).map((m) => ({
    data: new Date(m.data).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' }),
    peso: m.peso,
  }))

  if (data.length === 0) {
    return (
      <p className="text-muted-efc text-center py-3" style={{ fontSize: '0.875rem' }}>
        Nenhuma medição registrada.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="data" stroke="#606060" tick={{ fontSize: 11 }} />
        <YAxis stroke="#606060" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            background: '#111111',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            fontSize: 12,
            color: '#fff',
          }}
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke="#6c7f8e"
          strokeWidth={2.5}
          dot={<Dot r={4} fill="#6c7f8e" />}
          name="Peso (kg)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
