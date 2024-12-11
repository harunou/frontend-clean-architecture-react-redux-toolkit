import { type OrdersSnapshotDto, ServiceApi } from "../../api"
import type { ItemEntity, OrderEntity, ServiceGateway } from "../../types"
import { RemoteServiceGatewayStub } from "./RemoteServiceGatewayStub"

export class RemoteServiceGateway implements ServiceGateway {
  static make(): ServiceGateway {
    if (!import.meta.env.PROD) {
      return RemoteServiceGatewayStub.make()
    }
    return new RemoteServiceGateway(ServiceApi.make())
  }

  constructor(private api: ServiceApi) {}

  async logOrders(orders: OrderEntity[], items: ItemEntity[]): Promise<void> {
    await this.api.logOrdersSnapshot(mapOrderEntitiesToOrdersSnapshot(orders, items))
  }
}

function mapOrderEntitiesToOrdersSnapshot(
  orders: OrderEntity[],
  items: ItemEntity[],
): OrdersSnapshotDto {
  return {
    timestamp: Date.now(),
    orders: orders.map(order => ({
      id: order.id,
      userId: order.userId,
      entries: items.map(item => ({
        id: item.id,
        productId: item.productId,
        number: item.quantity,
      })),
    })),
  }
}
