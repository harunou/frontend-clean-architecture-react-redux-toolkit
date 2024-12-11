import { createDraftSafeSelector } from "@reduxjs/toolkit"
import { itemEntitySelectors } from "../itemEntitySelectors"
import { selectOrderSliceState } from "../../../../../selectors"

export const totalOrderItemQuantitySelector = createDraftSafeSelector(
  [selectOrderSliceState],
  (state): number => {
    const items = itemEntitySelectors.selectAll(state)
    return items.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  },
)
