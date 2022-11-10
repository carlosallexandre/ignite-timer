import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './NewCycleForm'
import { Countdown } from './Countdown'
import { useCycles } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo de ter no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function HomePage() {
  const { interruptCycle, activeCycle, createNewCycle } = useCycles()

  const methods = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = methods

  const task = watch('task')
  const isSubmitDisabled = !task

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleCreateNewCycle)}>
          <NewCycleForm />
          <Countdown />

          {activeCycle ? (
            <StopCountdownButton type="button" onClick={interruptCycle}>
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />
              Começar
            </StartCountdownButton>
          )}
        </form>
      </FormProvider>
    </HomeContainer>
  )
}
