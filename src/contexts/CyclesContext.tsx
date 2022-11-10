import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import {
  addNewCycleAction,
  Cycle,
  cyclesReducer,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles'

interface NewCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  interruptCycle(): void
  markCurrentCycleAsFinished(): void
  createNewCycle(data: NewCycleData): void
}

const CyclesContext = createContext({} as CyclesContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, null, () => {
    const storedStateAsJson = localStorage.getItem(
      '@ignite-timer:cycles-state-1.0.0',
    )

    if (storedStateAsJson) {
      return JSON.parse(storedStateAsJson)
    }

    return {
      cycles: [],
      activeCycleId: null,
    }
  })

  useEffect(() => {
    const stateAsJson = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateAsJson)
  }, [cyclesState])

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: NewCycleData) {
    const cycleId = String(new Date().getTime())

    const newCycle: Cycle = {
      id: cycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        markCurrentCycleAsFinished,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles() {
  const ctx = useContext(CyclesContext)

  if (!ctx)
    throw new Error('`useCycles` must be used into CyclesContextProvider')

  return ctx
}
