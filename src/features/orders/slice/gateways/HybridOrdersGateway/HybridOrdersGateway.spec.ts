import { HybridOrdersGateway } from "./HybridOrdersGateway"
import type { OrdersGateway } from "../../../types"
import { describe, beforeEach, it, expect, vi } from "vitest"

interface LocalTextContext {
  hybridOrdersGateway: HybridOrdersGateway
  remoteOrdersGateway: OrdersGateway
  localOrdersGateway: OrdersGateway
}

describe(`${HybridOrdersGateway.name}`, () => {
  beforeEach<LocalTextContext>(context => {
    context.remoteOrdersGateway = {
      getOrders: vi.fn(),
      getOrder: vi.fn(),
      updateOrder: vi.fn(),
      deleteOrder: vi.fn(),
      getItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    }
    context.localOrdersGateway = {
      getOrders: vi.fn(),
      getOrder: vi.fn(),
      updateOrder: vi.fn(),
      deleteOrder: vi.fn(),
      getItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    }
    context.hybridOrdersGateway = new HybridOrdersGateway(
      context.remoteOrdersGateway,
      context.localOrdersGateway,
    )
  })

  it<LocalTextContext>("uses local gateway be default", context => {
    expect(context.hybridOrdersGateway.gateway).toBe(context.localOrdersGateway)
  })

  describe("useRemoteGateway", () => {
    it<LocalTextContext>("sets the gateway to remoteGateway", context => {
      context.hybridOrdersGateway.useRemoteGateway()

      expect(context.hybridOrdersGateway.gateway).toBe(context.remoteOrdersGateway)
    })
  })

  describe("useLocalGateway", () => {
    it<LocalTextContext>("sets the gateway to localGateway", context => {
      context.hybridOrdersGateway.useLocalGateway()

      expect(context.hybridOrdersGateway.gateway).toBe(context.localOrdersGateway)
    })
  })
})
