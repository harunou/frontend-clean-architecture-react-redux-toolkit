import type { EntityState } from "@reduxjs/toolkit"
import { createEntityAdapter } from "@reduxjs/toolkit"
import invariant from "tiny-invariant"
import type {
  ItemEntity,
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
  OrdersGateway,
} from "../../../../types"
import { sleep } from "../../../../../../utils"

const orderEntityAdapter = createEntityAdapter<OrderEntity, OrderEntityId>({
  selectId: (item: OrderEntity) => item.id,
})
const orderEntitySelectors = orderEntityAdapter.getSelectors()

const itemEntityAdapter = createEntityAdapter<ItemEntity, ItemEntityId>({
  selectId: (item: ItemEntity) => item.id,
})

const itemEntitySelectors = itemEntityAdapter.getSelectors()

export class LocalOrdersGateway implements OrdersGateway {
  static instance: LocalOrdersGateway | null = null
  static make(orders: OrderEntity[] = [], items: ItemEntity[] = []): LocalOrdersGateway {
    if (LocalOrdersGateway.instance === null) {
      LocalOrdersGateway.instance = new LocalOrdersGateway(orders, items)
    }

    return LocalOrdersGateway.instance
  }

  private orders: EntityState<OrderEntity, OrderEntityId> = orderEntityAdapter.getInitialState()

  private items: EntityState<ItemEntity, ItemEntityId> = itemEntityAdapter.getInitialState()

  constructor(orders: OrderEntity[], items: ItemEntity[]) {
    this.orders = orderEntityAdapter.setAll(this.orders, orders)
    this.items = itemEntityAdapter.setAll(this.items, items)
  }

  async getOrders(): Promise<{
    orders: OrderEntity[]
    items: ItemEntity[]
  }> {
    await sleep()

    return {
      orders: orderEntitySelectors.selectAll(this.orders),
      items: itemEntitySelectors.selectAll(this.items),
    }
  }

  async getOrder(orderId: OrderEntityId): Promise<{ order: OrderEntity; items: ItemEntity[] }> {
    await sleep()

    const order = orderEntitySelectors.selectById(this.orders, orderId)

    invariant(order)

    const items = itemEntitySelectors
      .selectAll(this.items)
      .filter(item => order.itemEntityIds.includes(item.id))

    return { order, items }
  }

  async updateOrder(
    orderId: OrderEntityId,
    order: Partial<OrderEntity>,
    items?: ItemEntity[],
  ): Promise<void> {
    await sleep()

    const foundOrder = orderEntitySelectors.selectById(this.orders, orderId)

    invariant(foundOrder)

    if (items) {
      this.items = itemEntityAdapter.removeMany(this.items, foundOrder.itemEntityIds)
      order.itemEntityIds = items.map(item => item.id)
      this.items = itemEntityAdapter.upsertMany(this.items, items)
    }

    this.orders = orderEntityAdapter.updateOne(this.orders, {
      id: orderId,
      changes: {
        ...order,
      },
    })
  }

  async deleteOrder(id: OrderEntityId): Promise<void> {
    await sleep()

    this.orders = orderEntityAdapter.removeOne(this.orders, id)
  }

  async getItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<ItemEntity> {
    await sleep()

    const foundOrder = orderEntitySelectors.selectById(this.orders, orderId)
    if (!foundOrder) {
      throw new Error(`Order with id ${orderId} not found`)
    }

    const item = itemEntitySelectors.selectById(this.items, itemId)
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`)
    }

    return item
  }

  async updateItem(
    orderId: OrderEntityId,
    itemId: ItemEntityId,
    item: Partial<ItemEntity>,
  ): Promise<void> {
    await sleep()

    const foundOrder = orderEntitySelectors.selectById(this.orders, orderId)

    invariant(foundOrder)

    this.items = itemEntityAdapter.updateOne(this.items, {
      id: itemId,
      changes: {
        ...item,
      },
    })
  }

  async deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    await sleep()

    const foundOrder = orderEntitySelectors.selectById(this.orders, orderId)

    invariant(foundOrder)

    this.items = itemEntityAdapter.removeOne(this.items, itemId)

    this.orders = orderEntityAdapter.updateOne(this.orders, {
      id: orderId,
      changes: {
        itemEntityIds: foundOrder.itemEntityIds.filter(id => id !== itemId),
      },
    })
  }
}
