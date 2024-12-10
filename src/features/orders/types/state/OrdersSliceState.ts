import type { ItemEntityState, OrderEntityState, OrdersPresentation } from "../entities"

export interface OrdersSliceState {
  orderEntities: OrderEntityState
  itemEntities: ItemEntityState
  orderPresentation: OrdersPresentation
}
