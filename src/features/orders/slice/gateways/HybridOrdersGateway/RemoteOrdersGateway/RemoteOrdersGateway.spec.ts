import { describe, it, beforeEach, beforeAll, afterAll, afterEach } from "vitest"
import { RemoteOrdersGateway } from "./RemoteOrdersGateway"
import { testHttpClient } from "../../../../../../utils/testing"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { mapOrderIdToOrderEntityId } from "./RemoteOrdersGateway.utils"
import { type OrderDto } from "../../../../api"
import { orderDtoFactory, ordersApiUrl } from "../../../../api/OrdersApi"
import { type OrderEntity } from "../../../../types"

const server = setupServer()

interface LocalTestContext {
  gateway: RemoteOrdersGateway
}

describe(`${RemoteOrdersGateway.name}`, () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: "error",
    })
  })
  beforeEach<LocalTestContext>(context => {
    vi.restoreAllMocks()
    orderDtoFactory.resetCount()
    context.gateway = RemoteOrdersGateway.make()
  })
  afterEach(() => {
    testHttpClient.verify()
  })
  afterAll(() => {
    server.close()
  })
  describe("getOrders", () => {
    it<LocalTestContext>("fetches order entities", async context => {
      const ordersDto = orderDtoFactory.list({ count: 2 })
      const expected = {
        orders: [
          { id: "1", userId: "75", itemEntityIds: ["1", "2", "3"] },
          { id: "2", userId: "50", itemEntityIds: ["4", "5", "6"] },
        ],
        items: [
          { id: "1", productId: "59", quantity: 75 },
          { id: "2", productId: "17", quantity: 50 },
          { id: "3", productId: "93", quantity: 60 },
          { id: "4", productId: "25", quantity: 92 },
          { id: "5", productId: "10", quantity: 14 },
          { id: "6", productId: "21", quantity: 68 },
        ],
      }

      server.use(
        http.get(ordersApiUrl, () => HttpResponse.json(ordersDto), {
          once: true,
        }),
      )
      const result = await context.gateway.getOrders()
      expect(result).toEqual(expected)
    })
  })

  describe("getOrder", () => {
    it<LocalTestContext>("fetches order entity by an id", async context => {
      const orderDto = orderDtoFactory.item()
      const orderEntityId = mapOrderIdToOrderEntityId(orderDto.id)
      const expected = {
        order: { id: "1", userId: "75", itemEntityIds: ["7", "8", "9"] },
        items: [
          { id: "7", productId: "2", quantity: 6 },
          { id: "8", productId: "23", quantity: 70 },
          { id: "9", productId: "52", quantity: 69 },
        ],
      }

      server.use(
        http.get(`${ordersApiUrl}/${orderDto.id}`, () => HttpResponse.json(orderDto), {
          once: true,
        }),
      )
      const result = await context.gateway.getOrder(orderEntityId)
      expect(result).toEqual(expected)
    })
    it<LocalTestContext>("integrates with fetchOrders", async context => {
      const ordersDto = orderDtoFactory.list({ count: 2 })
      const orderDto = ordersDto.at(1)!

      const expected = {
        order: { id: "2", userId: "50", itemEntityIds: ["13", "14", "15"] },
        items: [
          { id: "13", productId: "54", quantity: 99 },
          { id: "14", productId: "20", quantity: 66 },
          { id: "15", productId: "16", quantity: 87 },
        ],
      }

      server.use(
        http.get(ordersApiUrl, () => HttpResponse.json(ordersDto), {
          once: true,
        }),
        http.get(`${ordersApiUrl}/${orderDto.id}`, () => HttpResponse.json(orderDto), {
          once: true,
        }),
      )
      const entities = await context.gateway.getOrders()
      const orderEntity = entities.orders.at(1)!
      const result = await context.gateway.getOrder(orderEntity.id)
      expect(result).toEqual(expected)
    })
  })

  describe("updateOrder", () => {
    it<LocalTestContext>("updates an order entity", async context => {
      const ordersDto = orderDtoFactory.list({ count: 2 })
      const expected = {
        order: { id: "2", userId: "9000", itemEntityIds: ["20"] },
        items: [{ id: "20", productId: "8", quantity: 9000 }],
      }

      server.use(
        http.get(ordersApiUrl, () => HttpResponse.json(ordersDto), {
          once: true,
        }),
        http.put<{ id: string }, Partial<OrderDto>>(
          `${ordersApiUrl}/:id`,
          async ({ request, params }) => {
            const updatedData = await request.json()

            const orderIndex = ordersDto.findIndex(order => order.id === params.id)
            if (orderIndex === -1) {
              return new Response(null, { status: 404 })
            }
            ordersDto[orderIndex] = {
              ...ordersDto[orderIndex],
              ...updatedData,
            }

            return new Response(null, { status: 204 })
          },
          { once: true },
        ),
        http.get(
          `${ordersApiUrl}/:id`,
          ({ params }) => {
            const dto = ordersDto.find(order => order.id === params.id)
            if (!dto) {
              return new Response(null, { status: 404 })
            }
            return HttpResponse.json(dto)
          },
          { once: true },
        ),
      )

      const entities = await context.gateway.getOrders()

      const order = entities.orders.at(1)!
      const items = entities.items.filter(item => order.itemEntityIds.includes(item.id))

      const updatedItems = items.slice(1, 2).map(item => ({
        ...item,
        quantity: 9000,
      }))
      const updatedOrder: OrderEntity = {
        ...entities.orders.at(1)!,
        userId: "9000",
        itemEntityIds: updatedItems.map(item => item.id),
      }

      await context.gateway.updateOrder(updatedOrder.id, updatedOrder, updatedItems)
      const result = await context.gateway.getOrder(updatedOrder.id)
      expect(result).toEqual(expected)
    })
  })
})
