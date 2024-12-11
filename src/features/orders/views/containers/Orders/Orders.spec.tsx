import { render, screen } from "@testing-library/react"
import { type FC } from "react"
import { ordersTestId, orderTestId, totalItemQuantityTestId } from "../../testIds"
import { Orders } from "./Orders"
import { describe, it, expect, beforeEach } from "vitest"
import type { ItemEntity, OrderEntity } from "../../../types"
import { makeTestOrderEntities } from "../../../utils/testing"
import { makeComponentFixture } from "../../../../../utils/testing/makeComponentFixture"
import { getOrdersGateway } from "../../../gateways"

interface LocalTestContext {
  orders: OrderEntity[]
  items: ItemEntity[]
  Sut: FC
}

describe(`${Orders.displayName}`, () => {
  beforeEach<LocalTestContext>(context => {
    const entities = makeTestOrderEntities()
    const { Fixture } = makeComponentFixture()
    context.Sut = () => (
      <Fixture>
        <Orders />
      </Fixture>
    )
    context.orders = entities.orders
    context.items = entities.items
  })

  it<LocalTestContext>("renders orders container with local gateway", async context => {
    render(<context.Sut />)

    const loadingElements = await screen.findAllByText(/loading/i)
    const ordersElement = await screen.findByTestId(ordersTestId)

    expect(loadingElements).toHaveLength(1)
    expect(ordersElement).toBeInTheDocument()
  })

  it<LocalTestContext>("renders orders container with remote gateway", async context => {
    const gateway = getOrdersGateway()

    vi.spyOn(gateway, "getOrders").mockResolvedValueOnce({
      orders: context.orders,
      items: context.items,
    })

    render(<context.Sut />)

    const ordersElement = await screen.findByTestId(ordersTestId)
    const userElements = await screen.findAllByTestId(orderTestId)

    expect(ordersElement).toBeInTheDocument()
    expect(userElements).toHaveLength(context.orders.length)
  })

  it<LocalTestContext>("renders total items quantity", async context => {
    const gateway = getOrdersGateway()

    vi.spyOn(gateway, "getOrders").mockResolvedValueOnce({
      orders: context.orders,
      items: context.items,
    })

    const expectedTotalItemsQuantity = context.items.reduce((acc, item) => acc + item.quantity, 0)

    render(<context.Sut />)

    const totalItemsQuantityElement = await screen.findByTestId(totalItemQuantityTestId)

    expect(totalItemsQuantityElement).toHaveTextContent(`${expectedTotalItemsQuantity}`)
  })
})
