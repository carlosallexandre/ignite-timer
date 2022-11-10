import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { useCycles } from '../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const { activeCycle, markCurrentCycleAsFinished } = useCycles()
  const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsAmountPassed : 0

  const minutes = String(Math.floor(currentSeconds / 60)).padStart(2, '0')
  const seconds = String(currentSeconds % 60).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      setSecondsAmountPassed(
        differenceInSeconds(new Date(), new Date(activeCycle.startDate)),
      )
    } else {
      setSecondsAmountPassed(0)
    }
  }, [activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiff = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDiff >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsAmountPassed(0)
          clearInterval(interval)
        } else {
          setSecondsAmountPassed(secondsDiff)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, markCurrentCycleAsFinished])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else {
      document.title = 'Ignite timer'
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
