import { itemEntityAdapter } from "../entities"
import type { OrdersSliceState } from "../types"

export const itemEntitySelectors = itemEntityAdapter.getSelectors<OrdersSliceState>(
  state => state.itemEntities,
)
