import { createDraftSafeSelector } from "@reduxjs/toolkit"
import type { OrderEntityId } from "../types"
import { selectOrderSliceState } from "../../../selectors"

export const isLastOrderSelector = createDraftSafeSelector(
  [selectOrderSliceState, (_state, orderId: OrderEntityId) => orderId],
  (state, orderId): boolean => {
    const lastId = state.orderEntities.ids.at(-1)
    return lastId === orderId
  },
)
