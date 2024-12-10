import { createDraftSafeSelector } from "@reduxjs/toolkit"
import { orderEntitySelectors } from "../orderEntitySelectors"
import { itemEntitySelectors } from "../itemEntitySelectors"
import type { ItemEntity, ItemEntityId, OrderEntityId } from "../../types"
import { selectOrderSliceState } from "../../../../selectors"

export const itemByIdSelector = createDraftSafeSelector(
  [
    selectOrderSliceState,
    (_state, orderId: OrderEntityId) => orderId,
    (_state, _orderId, itemId: ItemEntityId) => itemId,
  ],
  (state, orderId, itemId): ItemEntity | undefined => {
    const order = orderEntitySelectors.selectById(state, orderId)

    if (!order) {
      return
    }

    return itemEntitySelectors.selectById(state, itemId)
  },
)
