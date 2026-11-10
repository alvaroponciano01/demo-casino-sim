import { useEffect, useState } from 'react'
import { ArrowDownToLine, CircleHelp, Copy, History, Orbit, RotateCcw, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import GameChart from './components/GameChart'
import { useDemoCredits } from './hooks/useDemoCredits'
import { MAX_WAGER, MIN_WAGER, QUICK_WAGERS, STARTING_CREDITS } from './constants/game'
import { formatCredits } from './utils/format'
import type { RoundRecord, RoundStatus } from './types/game'
import './index.css'

const initialHistory: RoundRecord[] = [
  { id: 'sample-1', time: 'Demonstração', wager: 10, multiplier: 1.74, result: 'CASHOUT', payout: 17.4 },
  { id: 'sample-2', time: 'Demonstração', wager: 5, multiplier: 1.0, result: 'CRASH', payout: 0 },
]

function createCrashPoint() {
  return Math.round((1.12 + Math.random() * 6.8) * 100) / 100
}

export default function App() {
  const { credits, setCredits } = useDemoCredits()
  const [wager, setWager] = useState('10')
  const [status, setStatus] = useState<RoundStatus>('ready')
  const [multiplier, setMultiplier] = useState(1)
  const [crashAt, setCrashAt] = useState(2.4)
  const [history, setHistory] = useState<RoundRecord[]>(initialHistory)
  const [notice, setNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const numericWager = Number(wager)
  const running = status === 'running'
  const busy = status === 'loading'

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setMultiplier((current) => Math.round((current + 0.025) * 1000) / 1000), 100)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (running && multiplier >= crashAt) {
      setMultiplier(crashAt)
      setStatus('crashed')
      const record: RoundRecord = { id: crypto.randomUUID(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), wager: numericWager, multiplier: crashAt, result: 'CRASH', payout: 0 }
      setHistory((items) => [record, ...items].slice(0, 12))
      setNotice('A rodada terminou. Nenhum valor real foi utilizado.')
    }
  }, [running, multiplier, crashAt, numericWager])

  function startRound() {
    if (!Number.isFinite(numericWager) || numericWager < MIN_WAGER || numericWager > MAX_WAGER) {
      setNotice(`Informe um valor entre ${MIN_WAGER} e ${MAX_WAGER} créditos de demonstração.`)
      return
    }
    if (numericWager > credits) {
      setNotice('Créditos demonstrativos insuficientes. Use “Repor créditos”.')
      return
    }
    setNotice('')
    setStatus('loading')
    window.setTimeout(() => {
      setCredits((balance) => balance - numericWager)
      setCrashAt(createCrashPoint())
      setMultiplier(1)
      setStatus('running')
    }, 350)
  }

  function cashOut() {
    if (!running) return
    const payout = Math.round(numericWager * multiplier * 100) / 100
    setCredits((balance) => balance + payout)
    setStatus('cashed-out')
    const record: RoundRecord = { id: crypto.randomUUID(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), wager: numericWager, multiplier, result: 'CASHOUT', payout }
    setHistory((items) => [record, ...items].slice(0, 12))
    setNotice(`Saída simulada em ${multiplier.toFixed(2)}x. Crédito demonstrativo atualizado.`)
  }

  function resetRound() {
    if (running || busy) return
    setMultiplier(1)
    setStatus('ready')
    setNotice('Pronto para uma nova rodada de demonstração.')
  }

  function resetCredits() {
    if (running || busy) return
    setCredits(STARTING_CREDITS)
    setHistory([])
    setNotice('Créditos demonstrativos repostos. O histórico local foi limpo.')
  }

  async function copyDemoCode() {
    try {
      await navigator.clipboard.writeText('ORBIT-DEMO')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setNotice('Seu navegador não permitiu copiar. Código de demonstração: ORBIT-DEMO')
    }
  }

  return (
    <div className="app-shell">
      <div className="demo-banner"><ShieldCheck size={15} /> <span>AMBIENTE DE DEMONSTRAÇÃO — créditos fictícios, sem apostas ou dinheiro real</span></div>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Orbit início"><span className="brand-icon"><Orbit size={20} /></span><span>orbit<span className="brand-dot">.</span></span></a>
        <nav className="main-nav" aria-label="Navegação principal"><a className="active" href="#jogo">Jogo</a><a href="#historico">Histórico</a><a href="#sobre">Como funciona</a></nav>
        <div className="top-actions"><div className="credit-pill"><Wallet size={16} /><span>{formatCredits(credits)}</span><small>CRÉDITOS DEMO</small></div><button className="icon-button" onClick={resetCredits} disabled={running || busy} title="Repor créditos de demonstração" aria-label="Repor créditos"><RotateCcw size={17} /></button></div>
      </header>

      <main id="inicio" className="page-wrap">
        <div className="page-heading"><div><div className="eyebrow"><Sparkles size={14} /> SIMULADOR INTERATIVO</div><h1>Jogue com o <span>tempo.</span></h1><p>Teste sua estratégia em uma experiência demonstrativa e independente.</p></div><div className="live-tag"><span /> SIMULAÇÃO LOCAL</div></div>

        <section id="jogo" className="game-layout" aria-label="Jogo de demonstração">
          <div className="game-main panel"><div className="panel-top"><div><span className="section-label">ORBIT / RODADA</span><h2>Ascensão</h2></div><span className="demo-tag">DEMO</span></div>
            <GameChart multiplier={multiplier} running={running} crashed={status === 'crashed'} />
            {notice && <div className="notice" role="status">{notice}</div>}
            <div className="control-row"><div className="bet-control"><label htmlFor="wager">Créditos da rodada</label><div className="input-wrap"><input id="wager" type="number" min={MIN_WAGER} max={MAX_WAGER} step="1" value={wager} onChange={(event) => setWager(event.target.value)} disabled={running || busy} /><span>CR</span></div><div className="quick-amounts">{QUICK_WAGERS.map((amount) => <button key={amount} onClick={() => setWager(String(amount))} disabled={running || busy} className={numericWager === amount ? 'selected' : ''}>{amount}</button>)}</div></div>
              {running ? <button className="primary-button cashout-button" onClick={cashOut}><ArrowDownToLine size={17} /> SAIR AGORA <strong>{formatCredits(numericWager * multiplier)}</strong></button> : status === 'cashed-out' || status === 'crashed' ? <button className="primary-button" onClick={resetRound}><RotateCcw size={17} /> NOVA RODADA</button> : <button className="primary-button" onClick={startRound} disabled={busy}>{busy ? <><span className="spinner" /> PREPARANDO...</> : <><Sparkles size={17} /> INICIAR RODADA</>}</button>}
            </div>
            <div className="game-foot"><span><ShieldCheck size={14} /> Simulação independente, resultado aleatório local</span><span>Sem valor monetário</span></div>
          </div>

          <aside className="side-column"><section className="panel balance-card"><div className="card-heading"><span className="section-label">SUA CARTEIRA DEMO</span><Wallet size={17} /></div><div className="balance-value">{formatCredits(credits)} <small>CR</small></div><p>Saldo local demonstrativo</p><button className="secondary-button" onClick={resetCredits} disabled={running || busy}><RotateCcw size={15} /> Repor saldo inicial</button></section>
            <section id="sobre" className="panel how-card"><div className="card-heading"><span className="section-label">COMO FUNCIONA</span><CircleHelp size={17} /></div><ol><li><b>01</b><span>Escolha seus créditos fictícios para a rodada.</span></li><li><b>02</b><span>Inicie a simulação e acompanhe o gráfico.</span></li><li><b>03</b><span>Saia antes do fim para registrar o resultado demo.</span></li></ol><p className="fine-print">O saldo é armazenado apenas neste navegador. Não há depósitos, saques ou conexão com serviços externos.</p></section>
          </aside>
        </section>

        <section id="historico" className="panel history-panel"><div className="history-heading"><div><div className="section-label"><History size={14} /> ATIVIDADE LOCAL</div><h2>Rodadas recentes</h2></div><span className="history-count">{history.length} registros</span></div>
          {history.length === 0 ? <div className="empty-state"><div className="empty-icon"><History size={20} /></div><b>Nenhuma rodada ainda</b><span>Os resultados da sua demonstração aparecerão aqui.</span></div> : <div className="table-scroll"><table><thead><tr><th>Resultado</th><th>Horário</th><th>Créditos</th><th>Multiplicador</th><th>Retorno demo</th></tr></thead><tbody>{history.map((item) => <tr key={item.id}><td><span className={`result-chip ${item.result === 'CASHOUT' ? 'positive' : 'negative'}`}><span />{item.result === 'CASHOUT' ? 'SAÍDA' : 'FIM'}</span></td><td>{item.time}</td><td>{formatCredits(item.wager)} CR</td><td className={item.result === 'CASHOUT' ? 'mint-text' : ''}>{item.multiplier.toFixed(2)}x</td><td>{formatCredits(item.payout)} CR</td></tr>)}</tbody></table></div>}
          <div className="history-note">O histórico é demonstrativo e salvo somente durante esta sessão.</div>
        </section>

        <section className="referral-strip"><div className="referral-icon"><Sparkles size={18} /></div><div><b>Compartilhe a experiência demo</b><span>Convide alguém para testar este simulador independente.</span></div><button onClick={copyDemoCode}><Copy size={15} /> {copied ? 'COPIADO!' : 'COPIAR CÓDIGO'}</button></section>

        <details className="faq"><summary><CircleHelp size={16} /> Isto é uma plataforma de apostas?</summary><p>Não. Orbit é um projeto demonstrativo independente. Não aceita dinheiro, não processa apostas, não prevê resultados e não está conectado à plataforma mencionada como referência. Todas as rodadas e créditos são fictícios.</p></details>
      </main>
      <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-icon"><Orbit size={17} /></span><span>orbit<span className="brand-dot">.</span></span></a><span>Projeto independente para demonstração e aprendizado.</span><span>Sem dinheiro real · Sem integrações externas</span></footer>
    </div>
  )
}
