export type RoundStatus = 'ready' | 'loading' | 'running' | 'crashed' | 'cashed-out'

export interface RoundRecord {
  id: string
  time: string
  wager: number
  multiplier: number
  result: 'CASHOUT' | 'CRASH'
  payout: number
}
