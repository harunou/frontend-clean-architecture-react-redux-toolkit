import { type ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit"
import type { ItemEntity, ItemEntityId, OrderEntityId, OrdersSliceState } from "../types"
import { itemEntityAdapter } from "../entities"
import { getOrdersGateway } from "../gateways"

export const updateQuantityByItemId = createAsyncThunk(
  "orders/updateQuantityByItemId",
  async (params: {
    orderId: OrderEntityId
    itemId: ItemEntityId
    quantity: number
  }): Promise<{ item: ItemEntity }> => {
    const gateway = getOrdersGateway()

    await gateway.updateItem(params.orderId, params.itemId, {
      quantity: params.quantity,
    })
    const item = await gateway.getItem(params.orderId, params.itemId)
    return { item }
  },
)

export const attachUpdateQuantityByItemIdCases = (
  builder: ActionReducerMapBuilder<OrdersSliceState>,
) => {
  builder.addCase(updateQuantityByItemId.pending, state => {
    state.orderPresentation.isLoading = true
  })
  builder.addCase(updateQuantityByItemId.fulfilled, (state, action) => {
    state.orderPresentation.isLoading = false
    state.itemEntities = itemEntityAdapter.removeOne(state.itemEntities, action.meta.arg.itemId)
    state.itemEntities = itemEntityAdapter.addOne(state.itemEntities, action.payload.item)
  })
  builder.addCase(updateQuantityByItemId.rejected, state => {
    state.orderPresentation.isLoading = false
  })
}
