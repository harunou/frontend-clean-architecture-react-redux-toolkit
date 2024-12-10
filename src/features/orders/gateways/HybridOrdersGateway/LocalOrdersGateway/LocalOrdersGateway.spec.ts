import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { LocalOrdersGateway } from "./LocalOrdersGateway"
import type { ItemEntity, OrderEntity } from "../../../types"
import { orderEntityFactory } from "../../../utils/testing/OrderEntity.factory"
import { itemEntityFactory } from "../../../utils/testing/ItemEntity.factory"
import { makeTestOrderEntities } from "../../../utils/testing"
import { makeOrderEntityId } from "../../../utils"

interface LocalTestContext {
  orders: OrderEntity[]
  items: ItemEntity[]
  localOrdersGateway: LocalOrdersGateway
}

describe(`${LocalOrdersGateway.name}`, () => {
  beforeEach<LocalTestContext>(context => {
    vi.useFakeTimers()
    orderEntityFactory.resetCount()
    itemEntityFactory.resetCount()
    const entities = makeTestOrderEntities()
    context.orders = entities.orders
    context.items = entities.items
    context.localOrdersGateway = new LocalOrdersGateway(entities.orders, entities.items)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("fetchOrders", () => {
    it<LocalTestContext>("returns the list of orders", async context => {
      const result = context.localOrdersGateway.getOrders()

      vi.runAllTimers()

      await expect(result).resolves.toEqual({
        orders: context.orders,
        items: context.items,
      })
    })

    it("returns an empty array if no orders are available", async () => {
      const localOrdersGateway = new LocalOrdersGateway([], [])

      const fetchOrdersPromise = localOrdersGateway.getOrders()

      vi.runAllTimers()

      await expect(fetchOrdersPromise).resolves.toEqual({
        orders: [],
        items: [],
      })
    })
  })

  describe("getOrder", () => {
    it<LocalTestContext>("returns the order and its items", async context => {
      const order0 = context.orders.at(0)!
      const items0 = context.items.filter(item => order0.itemEntityIds.includes(item.id))

      const result = context.localOrdersGateway.getOrder(order0.id)

      vi.runAllTimers()

      await expect(result).resolves.toEqual({
        order: order0,
        items: items0,
      })
    })

    it<LocalTestContext>("throws an error if the order does not exist", async context => {
      const nonExistingOrderId = makeOrderEntityId("9999")

      const getOrderPromise = context.localOrdersGateway.getOrder(nonExistingOrderId)

      vi.runAllTimers()

      await expect(getOrderPromise).rejects.toThrowError()
    })
  })

  describe("updateOrder", () => {
    it<LocalTestContext>("updates the order", async context => {
      const order0 = context.orders.at(0)!
      const updatedOrder: OrderEntity = {
        ...order0,
        userId: "updated-user-id",
      }

      const updateOrderPromise = context.localOrdersGateway.updateOrder(order0.id, updatedOrder)

      vi.runAllTimers()

      await updateOrderPromise

      const resultPromise = context.localOrdersGateway.getOrder(order0.id)

      vi.runAllTimers()

      const result = await resultPromise

      expect(result.order).toEqual(updatedOrder)
    })

    it<LocalTestContext>("updates the items", async context => {
      const order0 = context.orders.at(0)!
      const updatedItems0: ItemEntity[] = context.items
        .filter(item => order0.itemEntityIds.includes(item.id))
        .map((item): ItemEntity => ({ ...item, quantity: 9000 }))
        .slice(0, 1)

      const updateOrderPromise = context.localOrdersGateway.updateOrder(
        order0.id,
        {},
        updatedItems0,
      )

      vi.runAllTimers()

      await updateOrderPromise

      const resultPromise = context.localOrdersGateway.getOrder(order0.id)
      vi.runAllTimers()
      const result = await resultPromise

      expect(result.items).toEqual(updatedItems0)
    })

    it<LocalTestContext>("throws an error if the order does not exist", async context => {
      const nonExistingOrderId = makeOrderEntityId("9999")

      const updateOrderPromise = context.localOrdersGateway.updateOrder(nonExistingOrderId, {
        userId: "update-user-id",
      })

      vi.runAllTimers()

      await expect(updateOrderPromise).rejects.toThrowError()
    })
  })

  describe("deleteOrder", () => {
    it<LocalTestContext>("deletes the order", async context => {
      const order0 = context.orders.at(0)!

      const deleteOrderPromise = context.localOrdersGateway.deleteOrder(order0.id)
      vi.runAllTimers()
      await deleteOrderPromise

      const resultPromise = context.localOrdersGateway.getOrder(order0.id)

      vi.runAllTimers()

      expect(resultPromise).rejects.toThrowError()
    })
  })

  describe("deleteItem", () => {
    it<LocalTestContext>("deletes the item", async context => {
      const order0 = context.orders.at(0)!
      const item0 = context.items.find(item => order0.itemEntityIds.includes(item.id))!

      const deleteItemPromise = context.localOrdersGateway.deleteItem(order0.id, item0.id)

      vi.runAllTimers()

      await deleteItemPromise

      const resultPromise = context.localOrdersGateway.getOrder(order0.id)

      vi.runAllTimers()

      const result = await resultPromise

      expect(result.items).not.toContain(item0)
    })
    it<LocalTestContext>("throws an error if the order does not exist", async context => {
      const nonExistingOrderId = makeOrderEntityId("9999")
      const item0 = context.items.at(0)!

      const deleteItemPromise = context.localOrdersGateway.deleteItem(nonExistingOrderId, item0.id)

      vi.runAllTimers()

      await expect(deleteItemPromise).rejects.toThrowError()
    })
  })
})
