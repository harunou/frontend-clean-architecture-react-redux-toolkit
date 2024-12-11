import { useMemo } from "react"
import { useRootDispatch } from "../../../../../../hooks"
import type { Controller } from "../Order.types"
import type { OrderEntityId } from "../../../../types"
import { deleteOrderById } from "../../../../slice"

export const useController = (orderId: OrderEntityId): Controller => {
  const dispatch = useRootDispatch()
  return useMemo(
    () => ({
      deleteOrderButtonClicked: () => {
        dispatch(deleteOrderById({ orderId }))
      },
    }),
    [dispatch, orderId],
  )
}
