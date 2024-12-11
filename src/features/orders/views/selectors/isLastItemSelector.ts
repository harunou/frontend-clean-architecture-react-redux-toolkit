import { createDraftSafeSelector } from "@reduxjs/toolkit"
import type { ItemEntityId, OrderEntityId } from "../../types"
import { orderEntitySelectors } from "./orderEntitySelectors"
import { selectOrderSliceState } from "../../../../selectors"

export const isLastItemSelector = createDraftSafeSelector(
  [
    selectOrderSliceState,
    (_state, orderId: OrderEntityId) => orderId,
    (_state, _orderId, itemId: ItemEntityId) => itemId,
  ],
  (state, orderId, itemId): boolean => {
    const order = orderEntitySelectors.selectById(state, orderId)
    if (!order) {
      return true
    }
    const lastItemId = order.itemEntityIds.at(-1)
    return lastItemId === itemId
  },
)
