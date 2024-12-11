import { type RootState } from "../../../stores/rootStore.types"
import type { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit"
import { getServiceGateway } from "./gateways"

export const ordersSnapshotLoggerMiddleware =
  (api: MiddlewareAPI<Dispatch, RootState>) =>
  (next: (action: unknown) => unknown) =>
  (action: unknown) => {
    const currentState = api.getState().orders

    const result = next(action)

    const updatedState = api.getState().orders

    if (currentState !== updatedState) {
      const gateway = getServiceGateway()
      const orders = Object.values(updatedState.orderEntities.entities)
      const items = Object.values(updatedState.itemEntities.entities)
      gateway.logOrders(orders, items)
    }

    return result
  }
