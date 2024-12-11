import type { OrdersGateway, OrdersGatewayRuntimeSwitch } from "../../types"
import { makeTestOrderEntities } from "../../utils/testing"
import { HybridOrdersGateway } from "./HybridOrdersGateway"

export const getOrdersGateway = (): OrdersGateway & OrdersGatewayRuntimeSwitch => {
  const entities = import.meta.env.DEV ? makeTestOrderEntities() : { orders: [], items: [] }
  return HybridOrdersGateway.make(entities.orders, entities.items)
}
