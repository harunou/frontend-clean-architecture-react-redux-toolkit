import type { ItemEntity, ItemEntityId, OrderEntity, OrderEntityId } from "../entities"

export interface OrdersGateway {
  getOrders(): Promise<{ orders: OrderEntity[]; items: ItemEntity[] }>
  getOrder(orderId: OrderEntityId): Promise<{ order: OrderEntity; items: ItemEntity[] }>
  updateOrder(
    orderId: OrderEntityId,
    order: Partial<OrderEntity>,
    items?: ItemEntity[],
  ): Promise<void>
  deleteOrder(orderId: OrderEntityId): Promise<void>
  getItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<ItemEntity>
  deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void>
  updateItem(orderId: OrderEntityId, itemId: ItemEntityId, item: Partial<ItemEntity>): Promise<void>
}

export interface OrdersGatewayRuntimeSwitch {
  useRemoteGateway(): void
  useLocalGateway(): void
}
