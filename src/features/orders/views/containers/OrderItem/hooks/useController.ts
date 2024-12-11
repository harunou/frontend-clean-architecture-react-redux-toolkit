import { useMemo } from "react"
import type { Controller } from "../OrderItem.types"
import { useRootDispatch } from "../../../../../../hooks"
import type { ItemEntityId, OrderEntityId } from "../../../../types"
import { deleteItemById } from "../../../../slice"

export const useController = (params: {
  orderId: OrderEntityId
  itemId: ItemEntityId
}): Controller => {
  const dispatch = useRootDispatch()
  return useMemo(
    () => ({
      deleteButtonClicked: () => {
        dispatch(
          deleteItemById({
            orderId: params.orderId,
            itemId: params.itemId,
          }),
        )
      },
    }),
    [dispatch, params.itemId, params.orderId],
  )
}
