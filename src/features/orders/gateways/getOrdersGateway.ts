import type { OrdersGateway } from "../types"
import { HybridOrdersGateway } from "./HybridOrdersGateway"

export const getOrdersGateway = (): OrdersGateway => {
  return HybridOrdersGateway.make()
}
