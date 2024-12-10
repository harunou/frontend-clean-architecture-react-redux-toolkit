import { type ItemEntity, type OrderEntity } from "../../types"
import { itemEntityFactory } from "./ItemEntity.factory"
import { orderEntityFactory } from "./OrderEntity.factory"

export const makeTestOrderEntities = (
  ordersCount: number = 3,
  itemsCount: number = 2,
): { orders: OrderEntity[]; items: ItemEntity[] } => {
  const orders = orderEntityFactory.list({ count: ordersCount })
  const items = orders.flatMap(order => {
    const entities = itemEntityFactory.list({ count: itemsCount })
    order.itemEntityIds = entities.map(entity => entity.id)
    return entities
  })
  return { orders, items }
}
