import invariant from "tiny-invariant"
import { type OrderDto, OrdersApi } from "../../../api"
import type {
  ItemEntity,
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
  OrdersGateway,
} from "../../../types"
import {
  mapItemEntityToOrderItemDto,
  mapOrderDtoToOrderEntity,
  mapOrderEntityIdToOrderId,
  mapOrderEntityToOrderDto,
  mapOrderItemDtoToItemEntity,
} from "./RemoteOrdersGateway.utils"

export class RemoteOrdersGateway implements OrdersGateway {
  static make(): RemoteOrdersGateway {
    return new RemoteOrdersGateway(OrdersApi.make())
  }

  constructor(private api: OrdersApi) {}

  async getOrders(): Promise<{
    orders: OrderEntity[]
    items: ItemEntity[]
  }> {
    const ordersDto = await this.api.fetchOrders()
    const entities = ordersDto.reduce(
      (acc: { orders: OrderEntity[]; items: ItemEntity[] }, orderDto) => {
        const entity = mapOrderDtoToOrderEntity(orderDto)
        return {
          orders: [...acc.orders, entity.order],
          items: [...acc.items, ...entity.items],
        }
      },
      { orders: [], items: [] },
    )
    return entities
  }

  async getOrder(orderId: OrderEntityId): Promise<{ order: OrderEntity; items: ItemEntity[] }> {
    const orderDto = await this.api.getOrder(mapOrderEntityIdToOrderId(orderId))
    return mapOrderDtoToOrderEntity(orderDto)
  }

  async updateOrder(
    orderId: OrderEntityId,
    order: Partial<OrderEntity>,
    items?: ItemEntity[],
  ): Promise<void> {
    const dto: Partial<OrderDto> = mapOrderEntityToOrderDto(order, items)
    const id = mapOrderEntityIdToOrderId(orderId)
    await this.api.updateOrder(id, dto)
  }

  async deleteOrder(orderId: OrderEntityId): Promise<void> {
    await this.api.deleteOrder(orderId)
  }

  async getItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<ItemEntity> {
    const orderDto = await this.api.getOrder(orderId)
    const itemDto = orderDto.items.find(item => item.id === itemId)

    invariant(itemDto)

    return mapOrderItemDtoToItemEntity(itemDto)
  }

  async updateItem(
    orderId: OrderEntityId,
    itemId: ItemEntityId,
    item: Partial<ItemEntity>,
  ): Promise<void> {
    const orderDto = await this.api.getOrder(orderId)
    const itemDto = orderDto.items.find(dto => dto.id === itemId)

    if (!itemDto) {
      return
    }

    const items = orderDto.items.map(dto =>
      dto.id === itemId ? { ...dto, ...mapItemEntityToOrderItemDto(item) } : dto,
    )
    await this.api.updateOrder(orderId, { items })
  }

  async deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    const orderDto = await this.api.getOrder(orderId)
    const items = orderDto.items.filter(item => item.id !== itemId)
    await this.api.updateOrder(orderId, { items })
  }
}
