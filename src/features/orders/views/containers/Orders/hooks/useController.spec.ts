import { useController } from "./useController"
import { vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { HybridOrdersGateway } from "../../../../gateways"
import { makeTestOrderEntities } from "../../../../utils/testing"
import { sleep } from "../../../../../../utils"
import { makeComponentFixture } from "../../../../../../utils/testing/makeComponentFixture"

describe(`${useController.name}`, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("runs and aborts loadOrders in order", async () => {
    const entities = makeTestOrderEntities()
    const gateway = HybridOrdersGateway.make()
    vi.spyOn(gateway, "getOrders").mockImplementation(async () => {
      await sleep()
      return entities
    })
    const { Fixture, store } = makeComponentFixture()

    const { result } = renderHook(() => useController(), {
      wrapper: Fixture,
    })

    result.current.moduleStarted()
    await vi.runOnlyPendingTimersAsync()
    const isLoading0 = store.getState().orders.orderPresentation.isLoading
    const orders0 = store.getState().orders.orderEntities
    result.current.moduleDestroyed()
    await vi.runOnlyPendingTimersAsync()
    const isLoading1 = store.getState().orders.orderPresentation.isLoading
    const orders1 = store.getState().orders.orderEntities

    result.current.moduleStarted()
    await vi.runOnlyPendingTimersAsync()
    const isLoading2 = store.getState().orders.orderPresentation.isLoading
    const orders2 = store.getState().orders.orderEntities
    result.current.moduleDestroyed()
    await vi.runOnlyPendingTimersAsync()
    const isLoading3 = store.getState().orders.orderPresentation.isLoading
    const orders3 = store.getState().orders.orderEntities

    result.current.moduleStarted()
    await vi.runOnlyPendingTimersAsync()
    const isLoading4 = store.getState().orders.orderPresentation.isLoading
    const orders4 = store.getState().orders.orderEntities
    await vi.runOnlyPendingTimersAsync()
    const isLoading5 = store.getState().orders.orderPresentation.isLoading
    const orders5 = store.getState().orders.orderEntities

    expect(result.current).toBeDefined()
    expect([isLoading0, isLoading1, isLoading2, isLoading3, isLoading4, isLoading5]).toEqual([
      true,
      false,
      true,
      false,
      true,
      false,
    ])
    expect([orders0.ids, orders1.ids, orders2.ids, orders3.ids, orders4.ids, orders5.ids]).toEqual([
      [],
      [],
      [],
      [],
      [],
      entities.orders.map(o => o.id),
    ])
  })
})
