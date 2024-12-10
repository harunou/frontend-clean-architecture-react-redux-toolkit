import type { ItemEntityId, OrderEntityId } from "../types"

export const makeItemEntityId = (id: string): ItemEntityId => {
  return id as ItemEntityId
}

export const makeOrderEntityId = (id: string): OrderEntityId => {
  return id as OrderEntityId
}
