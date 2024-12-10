import type { ItemEntity, ItemEntityId, OrderEntity, OrderEntityId } from "../../../types"
import { makeItemEntityId, makeOrderEntityId } from "../../../utils"
import type { OrderDto, OrderItemDto } from "../../../api"
import { removeUndefinedFields } from "../../../../../utils"

export const mapOrderIdToOrderEntityId = (remoteId: string): OrderEntityId => {
  return makeOrderEntityId(remoteId)
}

export const mapItemIdToItemEntityId = (remoteId: string): ItemEntityId => {
  return makeItemEntityId(remoteId)
}

export const mapOrderEntityIdToOrderId = (id: OrderEntityId): string => {
  return id
}

export const mapItemEntityIdToItemId = (id: ItemEntityId): string => {
  return id
}

export const mapOrderDtoToOrderEntity = (
  dto: OrderDto,
): { order: OrderEntity; items: ItemEntity[] } => {
  const order: OrderEntity = {
    id: mapOrderIdToOrderEntityId(dto.id),
    userId: dto.userId,
    itemEntityIds: [],
  }
  const items: ItemEntity[] = dto.items.map(mapOrderItemDtoToItemEntity)
  order.itemEntityIds = items.map(item => item.id)
  return { order, items }
}

export const mapOrderEntityToOrderDto = (
  order: Partial<OrderEntity>,
  items?: ItemEntity[],
): Partial<OrderDto> => {
  return removeUndefinedFields({
    userId: order.userId,
    items: items?.map(item => ({
      id: mapItemEntityIdToItemId(item.id),
      productId: item.productId,
      quantity: item.quantity,
    })),
  })
}

export const mapOrderItemDtoToItemEntity = (dto: OrderItemDto): ItemEntity => {
  return {
    id: mapItemIdToItemEntityId(dto.id),
    productId: dto.productId,
    quantity: dto.quantity,
  }
}

export const mapItemEntityToOrderItemDto = (item: Partial<ItemEntity>): Partial<OrderItemDto> => {
  return removeUndefinedFields({
    productId: item.productId,
    quantity: item.quantity,
  })
}
