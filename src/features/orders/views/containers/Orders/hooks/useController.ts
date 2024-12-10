import { useMemo, useRef } from "react"
import type { Controller } from "../Orders.types"
import { useRootDispatch } from "../../../../../../hooks"
import { loadOrders } from "../../../../thunks"
import { sleep } from "../../../../../../utils"

export const useController = (): Controller => {
  const dispatch = useRootDispatch()
  const loadOrdersActionRef = useRef<
    { abort: () => void; finally: (cb: () => void) => void } | undefined
  >()
  return useMemo(
    () => ({
      moduleStarted: async () => {
        // NOTE(harunou): timeout is needed to order pending, rejected and
        // fulfilled actions in the event loop
        await sleep()
        loadOrdersActionRef.current = dispatch(loadOrders())
        loadOrdersActionRef.current?.finally(() => {
          loadOrdersActionRef.current = undefined
        })
      },
      moduleDestroyed: async () => {
        await sleep()
        loadOrdersActionRef.current?.abort()
      },
    }),
    [dispatch],
  )
}
