import { useCallback, useEffect, useRef } from "react"

export const useRenderCounter = (): (() => number) => {
  const countRef = useRef(0)

  useEffect(() => {
    countRef.current += 1
  })

  useEffect(() => {
    return (): void => {
      countRef.current = 0
    }
  }, [])

  return useCallback(() => countRef.current, [])
}

export const output = <T extends {}>(data: T): string => {
  return JSON.stringify(data)
}
