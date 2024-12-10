import { type ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit"
import type { ItemEntity, OrderEntity, OrdersSliceState } from "../types"
import { HybridOrdersGateway } from "../gateways"
import { itemEntityAdapter, orderEntityAdapter } from "../entities"

export const loadOrders = createAsyncThunk(
  "orders/loadOrders",
  async (): Promise<{
    orders: OrderEntity[]
    items: ItemEntity[]
  }> => {
    const gateway = HybridOrdersGateway.make()
    const { orders, items } = await gateway.getOrders()
    return { orders, items }
  },
)

export const attachLoadOrdersCases = (builder: ActionReducerMapBuilder<OrdersSliceState>) => {
  builder.addCase(loadOrders.pending, state => {
    state.orderPresentation.isLoading = true
  })
  builder.addCase(loadOrders.fulfilled, (state, action) => {
    state.orderPresentation.isLoading = false
    state.orderEntities = orderEntityAdapter.setAll(state.orderEntities, action.payload.orders)
    state.itemEntities = itemEntityAdapter.setAll(state.itemEntities, action.payload.items)
  })
  builder.addCase(loadOrders.rejected, state => {
    state.orderPresentation.isLoading = false
  })
}
