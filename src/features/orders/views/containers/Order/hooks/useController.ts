import { useMemo } from "react"
import { useRootDispatch } from "../../../../../../hooks"
import type { OrderEntityId } from "../../../../types"
import type { Controller } from "../Order.types"
import { deleteOrderById } from "../../../../thunks"

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
