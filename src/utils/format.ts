export function formatCredits(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

export function readStoredCredits(): number {
  try {
    const value = Number(localStorage.getItem('orbit-demo-credits'))
    return Number.isFinite(value) && value >= 0 ? value : 1_000
  } catch {
    return 1_000
  }
}
