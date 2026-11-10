import { useEffect, useState } from 'react'
import { readStoredCredits } from '../utils/format'

export function useDemoCredits() {
  const [credits, setCredits] = useState(readStoredCredits)

  useEffect(() => {
    try {
      localStorage.setItem('orbit-demo-credits', String(credits))
    } catch {
      // Storage may be disabled; the simulator still works for this session.
    }
  }, [credits])

  return { credits, setCredits }
}
