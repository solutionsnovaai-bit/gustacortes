import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react'

const Ctx = createContext({ paused: false, reduced: false, toggle: () => {} })

/** Respeita "reduzir movimento" do sistema e o botão "Pausar movimento" do rodapé. */
export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const system = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const reduced = Boolean(system) || paused
  return <Ctx.Provider value={{ paused, reduced, toggle: () => setPaused(v => !v) }}>
    <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion={reduced ? 'always' : 'user'}><div className={reduced ? 'movimento-pausado' : undefined}>{children}</div></MotionConfig></LazyMotion>
  </Ctx.Provider>
}
export const useMotionPreferences = () => useContext(Ctx)
