import type { EntityState } from "@reduxjs/toolkit"
import type { ItemEntityId } from "../ItemEntity"
import type { Nominal, UniqueEntity } from "../../../../../@types"

export type OrderEntityId = Nominal<string, "ORDER_ENTITY_ID">

export type OrderEntity = UniqueEntity<OrderEntityId> & {
  userId: string
  itemEntityIds: ItemEntityId[]
}

export type OrderEntityState = EntityState<OrderEntity, OrderEntityId>
