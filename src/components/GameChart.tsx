import { useMemo } from 'react'

interface GameChartProps {
  multiplier: number
  running: boolean
  crashed: boolean
}

export default function GameChart({ multiplier, running, crashed }: GameChartProps) {
  const path = useMemo(() => {
    const progress = Math.min(Math.max((multiplier - 1) / 4.5, 0), 1)
    const points = Array.from({ length: 28 }, (_, index) => {
      const x = 28 + (index / 27) * 544 * progress
      const t = index / 27
      const y = 266 - (Math.pow(t, 1.6) * (multiplier - 1) * 41)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${Math.max(34, y).toFixed(1)}`
    })
    return points.join(' ')
  }, [multiplier])

  const color = crashed ? '#fb7185' : '#55e6bd'
  return (
    <div className={`chart-stage ${running ? 'chart-running' : ''}`} aria-label={`Gráfico do jogo, multiplicador ${multiplier.toFixed(2)}x`}>
      <div className="chart-grid" />
      <div className={`chart-state ${crashed ? 'text-rose-300' : ''}`}>{crashed ? 'RODADA ENCERRADA' : running ? 'RODADA EM ANDAMENTO' : 'PRONTO PARA JOGAR'}</div>
      <div className={`multiplier-readout ${crashed ? 'text-rose-300' : ''}`}>{multiplier.toFixed(2)}<span>x</span></div>
      <svg className="chart-svg" viewBox="0 0 600 300" preserveAspectRatio="none" role="img" aria-hidden="true">
        <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".23" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        <path d={`${path} L 572 286 L 28 286 Z`} fill="url(#areaFill)" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <circle cx={28 + Math.min(Math.max((multiplier - 1) / 4.5, 0), 1) * 544} cy={Math.max(34, 266 - ((multiplier - 1) * 41))} r="5" fill={color} />
      </svg>
      <div className="chart-labels"><span>0s</span><span>tempo</span><span>∞</span></div>
    </div>
  )
}
