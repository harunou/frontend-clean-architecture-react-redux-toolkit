import type {
  OrderEntity,
  OrdersGateway,
  OrdersGatewayRuntimeSwitch,
  ItemEntity,
  OrderEntityId,
  ItemEntityId,
} from "../../types"
import { makeTestOrderEntities } from "../../utils/testing/makeTestOrderEntities"
import { LocalOrdersGateway } from "./LocalOrdersGateway"
import { RemoteOrdersGateway } from "./RemoteOrdersGateway"

export class HybridOrdersGateway implements OrdersGateway, OrdersGatewayRuntimeSwitch {
  private static instance: HybridOrdersGateway | null = null
  static make(): OrdersGateway & OrdersGatewayRuntimeSwitch {
    const entities = import.meta.env.DEV ? makeTestOrderEntities() : { orders: [], items: [] }
    const localGateway = LocalOrdersGateway.make(entities.orders, entities.items)
    const remoteGateway = RemoteOrdersGateway.make()
    if (HybridOrdersGateway.instance === null) {
      HybridOrdersGateway.instance = new HybridOrdersGateway(remoteGateway, localGateway)
    }
    return HybridOrdersGateway.instance
  }

  gateway: OrdersGateway

  constructor(
    private remoteGateway: OrdersGateway,
    private localGateway: OrdersGateway,
  ) {
    this.gateway = this.localGateway
  }

  useRemoteGateway(): void {
    this.gateway = this.remoteGateway
  }

  useLocalGateway(): void {
    this.gateway = this.localGateway
  }

  getOrders(): Promise<{ orders: OrderEntity[]; items: ItemEntity[] }> {
    return this.gateway.getOrders()
  }

  getOrder(orderId: OrderEntityId): Promise<{ order: OrderEntity; items: ItemEntity[] }> {
    return this.gateway.getOrder(orderId)
  }

  updateOrder(
    orderId: OrderEntityId,
    order: Partial<OrderEntity>,
    items?: ItemEntity[],
  ): Promise<void> {
    return this.gateway.updateOrder(orderId, order, items)
  }

  deleteOrder(orderId: OrderEntityId): Promise<void> {
    return this.gateway.deleteOrder(orderId)
  }

  getItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<ItemEntity> {
    return this.gateway.getItem(orderId, itemId)
  }

  updateItem(
    orderId: OrderEntityId,
    itemId: ItemEntityId,
    item: Partial<ItemEntity>,
  ): Promise<void> {
    return this.gateway.updateItem(orderId, itemId, item)
  }

  deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    return this.gateway.deleteItem(orderId, itemId)
  }
}
