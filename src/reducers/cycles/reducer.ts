import { produce } from 'immer'
import { CyclesState } from './types'
import { ActionTypes } from './actions'

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.activeCycleId = action?.payload?.newCycle.id
        draft.cycles.push(action.payload.newCycle)
      })
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) {
        return state
      } else {
        return produce(state, (draft) => {
          draft.activeCycleId = null
          draft.cycles[currentCycleIndex].finishedDate = new Date()
        })
      }
    }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) {
        return state
      } else {
        return produce(state, (draft) => {
          draft.activeCycleId = null
          draft.cycles[currentCycleIndex].interruptedDate = new Date()
        })
      }
    }
    default:
      return state
  }
}
