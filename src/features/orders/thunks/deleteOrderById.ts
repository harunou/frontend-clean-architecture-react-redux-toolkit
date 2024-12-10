import { type ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit"
import type { OrderEntityId, OrdersSliceState } from "../types"
import { HybridOrdersGateway } from "../gateways"
import { itemEntityAdapter, orderEntityAdapter } from "../entities"

export const deleteOrderById = createAsyncThunk(
  "orders/deleteOrderById",
  async (params: { orderId: OrderEntityId }): Promise<void> => {
    const gateway = HybridOrdersGateway.make()
    await gateway.deleteOrder(params.orderId)
  },
)

export const attachDeleteOrderByIdCases = (builder: ActionReducerMapBuilder<OrdersSliceState>) => {
  builder.addCase(deleteOrderById.rejected, state => {
    state.orderPresentation.isLoading = false
  })
  builder.addCase(deleteOrderById.pending, state => {
    state.orderPresentation.isLoading = true
  })
  builder.addCase(deleteOrderById.fulfilled, (state, action) => {
    state.orderPresentation.isLoading = false
    const order = state.orderEntities.entities[action.meta.arg.orderId]
    if (!order) {
      return
    }
    state.orderEntities = orderEntityAdapter.removeOne(state.orderEntities, action.meta.arg.orderId)
    state.itemEntities = itemEntityAdapter.removeMany(state.itemEntities, order.itemEntityIds)
  })
}
