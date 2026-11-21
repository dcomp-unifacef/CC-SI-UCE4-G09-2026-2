import { useMemo } from 'react'
import { frequenciasMock } from '../data/mockData'

interface Props { alunoId: string; days?: number }

export default function HeatmapPresenca({ alunoId, days = 90 }: Props) {
  const cells = useMemo(() => {
    const checkins = new Set(
      frequenciasMock
        .filter((f) => f.alunoId === alunoId)
        .map((f) => f.data),
    )
    const result: { iso: string; level: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      result.push({ iso, level: checkins.has(iso) ? 4 : 0 })
    }
    return result
  }, [alunoId, days])

  // Split into weeks (columns of 7)
  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((cell) => (
              <div
                key={cell.iso}
                className="heatmap-cell"
                data-level={cell.level}
                title={cell.iso}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="d-flex align-items-center gap-1 mt-2" style={{ fontSize: '0.625rem', color: '#606060' }}>
        <span>Menos</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className="heatmap-cell" data-level={l} />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}
