import { useEffect, useRef, useState } from 'react'

export function useQuizTimer(
  initialSeconds: number,
  onExpire: () => void,
  resetKey = 0,
) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [stopped, setStopped] = useState(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    setStopped(false)
  }, [initialSeconds, resetKey])

  useEffect(() => {
    if (stopped) return

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setStopped(true)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [stopped, resetKey])

  const stop = () => setStopped(true)

  return { secondsLeft, stop }
}
