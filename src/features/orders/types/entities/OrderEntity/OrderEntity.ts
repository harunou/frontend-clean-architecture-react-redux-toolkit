import type { EntityState } from "@reduxjs/toolkit"
import type { Nominal, UniqueEntity } from "../../../../../@types"
import type { ItemEntityId } from "../ItemEntity"

export type OrderEntityId = Nominal<string, "ORDER_ENTITY_ID">

export type OrderEntity = UniqueEntity<OrderEntityId> & {
  userId: string
  itemEntityIds: ItemEntityId[]
}

export type OrderEntityState = EntityState<OrderEntity, OrderEntityId>
