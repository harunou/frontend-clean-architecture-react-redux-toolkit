import type { ServiceGateway } from "../types"
import { RemoteServiceGateway } from "./RemoteServiceGateway"

export const getServiceGateway = (): ServiceGateway => {
  return RemoteServiceGateway.make()
}
