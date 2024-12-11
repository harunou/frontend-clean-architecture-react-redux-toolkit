import { useMemo } from "react"
import { useRootSelector } from "../../../../../../hooks"
import { isLastOrderSelector, orderByIdSelector } from "../../../selectors"
import type { Presenter } from "../Order.types"
import type { OrderEntityId } from "../../../../types"

export const usePresenter = (orderId: OrderEntityId): Presenter => {
  const order = useRootSelector(state => orderByIdSelector(state, orderId))
  const isLastOrder = useRootSelector(state => isLastOrderSelector(state, orderId))

  return useMemo(() => {
    if (!order) {
      return {
        hasOrder: false,
      }
    }
    return {
      hasOrder: true,
      userId: order.userId,
      orderId: order.id,
      itemIds: order.itemEntityIds,
      isLastOrder: isLastOrder,
    }
  }, [order, isLastOrder])
}
