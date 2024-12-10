import { type ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit"
import type { ItemEntityId, OrderEntityId, OrdersSliceState } from "../../types"
import { HybridOrdersGateway } from "../../gateways"
import { itemEntityAdapter, orderEntityAdapter } from "../../entities"

export const deleteItemById = createAsyncThunk(
  "orders/deleteItemById",
  async (params: { orderId: OrderEntityId; itemId: ItemEntityId }): Promise<void> => {
    const gateway = HybridOrdersGateway.make()
    await gateway.deleteItem(params.orderId, params.itemId)
  },
)

export const attachDeleteItemByIdCases = (builder: ActionReducerMapBuilder<OrdersSliceState>) => {
  builder.addCase(deleteItemById.rejected, state => {
    state.orderPresentation.isLoading = false
  })
  builder.addCase(deleteItemById.pending, state => {
    state.orderPresentation.isLoading = true
  })
  builder.addCase(deleteItemById.fulfilled, (state, action) => {
    state.orderPresentation.isLoading = false
    const order = state.orderEntities.entities[action.meta.arg.orderId]
    if (!order) {
      return
    }
    state.itemEntities = itemEntityAdapter.removeOne(state.itemEntities, action.meta.arg.itemId)
    state.orderEntities = orderEntityAdapter.updateOne(state.orderEntities, {
      id: action.meta.arg.orderId,
      changes: {
        itemEntityIds: order.itemEntityIds.filter(
          itemEntityId => itemEntityId !== action.meta.arg.itemId,
        ),
      },
    })
  })
}
