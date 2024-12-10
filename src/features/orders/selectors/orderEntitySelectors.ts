import { orderEntityAdapter } from "../entities"
import type { OrdersSliceState } from "../types"

export const orderEntitySelectors = orderEntityAdapter.getSelectors<OrdersSliceState>(
  state => state.orderEntities,
)
