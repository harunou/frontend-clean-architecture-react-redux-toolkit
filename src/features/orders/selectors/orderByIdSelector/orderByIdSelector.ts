import { createDraftSafeSelector } from "@reduxjs/toolkit"
import type { OrderEntity, OrderEntityId } from "../../types"
import { orderEntitySelectors } from "../orderEntitySelectors"
import { selectOrderSliceState } from "../../../../selectors"

export const orderByIdSelector = createDraftSafeSelector(
  [selectOrderSliceState, (_state, orderId: OrderEntityId) => orderId],
  (state, orderId): OrderEntity | undefined => {
    return orderEntitySelectors.selectById(state, orderId)
  },
)
