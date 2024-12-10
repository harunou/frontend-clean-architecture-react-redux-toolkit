import type { EntityState } from "@reduxjs/toolkit"
import type { Nominal, UniqueEntity } from "../../../../../@types"

export type ItemEntityId = Nominal<string, "ITEM_ENTITY_ID">

export type ItemEntity = UniqueEntity<ItemEntityId> & {
  productId: string
  quantity: number
}

export type ItemEntityState = EntityState<ItemEntity, ItemEntityId>
