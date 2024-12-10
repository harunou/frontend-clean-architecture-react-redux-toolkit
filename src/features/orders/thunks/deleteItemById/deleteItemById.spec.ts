import { makeRootStore } from "../../../../stores/makeRootStore"
import { makeTestOrderEntities } from "../../utils/testing"
import { HybridOrdersGateway } from "../../gateways"
import { orderEntityAdapter, itemEntityAdapter } from "../../entities"
import type { OrderEntityId, ItemEntityId } from "../../types"
import { makeOrderEntityId, makeItemEntityId } from "../../utils"
import { deleteItemById } from "./deleteItemById"
import { describe, it, expect, vi } from "vitest"

describe(`${deleteItemById.name}`, () => {
  it("calls the deleteItem method on the gateway", async () => {
    const gateway = HybridOrdersGateway.make()
    const deleteItemSpy = vi.spyOn(gateway, "deleteItem").mockResolvedValueOnce()

    const orderId: OrderEntityId = makeOrderEntityId("order-id")
    const itemId: ItemEntityId = makeItemEntityId("item-id")

    const rootStore = makeRootStore()
    await rootStore.dispatch(deleteItemById({ orderId, itemId }))

    expect(deleteItemSpy).toHaveBeenCalledWith(orderId, itemId)
  })

  it("removes the item from the store if the deletion is successful", async () => {
    const entities = makeTestOrderEntities()

    const rootStore = makeRootStore()
    const initialState = rootStore.getState()
    initialState.orders = {
      ...initialState.orders,
      orderEntities: orderEntityAdapter.getInitialState({}, entities.orders),
      itemEntities: itemEntityAdapter.getInitialState({}, entities.items),
    }
    const sutStore = makeRootStore(initialState)

    const gateway = HybridOrdersGateway.make()
    gateway.useRemoteGateway()
    vi.spyOn(gateway, "deleteItem").mockResolvedValueOnce()

    const orderId = entities.orders.at(1)!.id
    const itemId = entities.orders.at(1)!.itemEntityIds.at(1)!

    const expected = entities.items.filter(i => i.id !== itemId).map(i => i.id)

    await sutStore.dispatch(deleteItemById({ orderId, itemId }))

    const state = sutStore.getState()

    expect(state.orders.itemEntities.ids).toEqual(expected)
  })
})
