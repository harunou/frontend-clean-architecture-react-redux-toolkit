import { createEntityAdapter } from "@reduxjs/toolkit"
import type { ItemEntity, OrderEntity } from "../../types"

export const orderEntityAdapter = createEntityAdapter({
  selectId: (order: OrderEntity) => order.id,
})

export const itemEntityAdapter = createEntityAdapter({
  selectId: (item: ItemEntity) => item.id,
})
