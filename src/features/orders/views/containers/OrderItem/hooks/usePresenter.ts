import { useMemo } from "react"
import { useRootSelector } from "../../../../../../hooks"
import { isLastItemSelector, itemByIdSelector } from "../../../selectors"
import type { ItemEntityId, OrderEntityId } from "../../../../types"
import type { Presenter } from "../OrderItem.types"

export const usePresenter = (params: {
  orderId: OrderEntityId
  itemId: ItemEntityId
}): Presenter => {
  const item = useRootSelector(state => itemByIdSelector(state, params.orderId, params.itemId))
  const isLastItem: boolean = useRootSelector(state =>
    isLastItemSelector(state, params.orderId, params.itemId),
  )

  return useMemo(() => {
    if (!item) {
      return {
        hasItem: false,
      }
    }
    return {
      hasItem: true,
      itemId: item.id,
      productId: item.productId,
      productQuantity: item.quantity,
      isLastItem: isLastItem,
    }
  }, [item, isLastItem])
}
