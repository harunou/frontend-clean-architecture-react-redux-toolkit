import { orderEntityAdapter } from "../../slice"
import type { OrdersSliceState } from "../../types"

export const orderEntitySelectors = orderEntityAdapter.getSelectors<OrdersSliceState>(
  state => state.orderEntities,
)
