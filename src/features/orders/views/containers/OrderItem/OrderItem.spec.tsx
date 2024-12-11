import { render, screen } from "@testing-library/react"
import { type FC, act } from "react"
import { describe, it, expect, beforeEach } from "vitest"
import { itemEntityAdapter, orderEntityAdapter } from "../../../entities"
import { updateQuantityByItemId } from "../../../thunks"
import type { OrderEntityId, ItemEntityId, OrderEntity, ItemEntity } from "../../../types"
import { OrderItem } from "./OrderItem"
import { makeTestOrderEntities } from "../../../utils/testing"
import type { RootState, RootStore } from "../../../../../stores/rootStore.types"
import { makeComponentFixture } from "../../../../../utils/testing/makeComponentFixture"
import { initialState } from "../../../slice"
import { getOrdersGateway } from "../../../gateways"

interface LocalTestContext {
  Sut: FC<{ orderId: OrderEntityId; itemId: ItemEntityId }>
  orders: OrderEntity[]
  items: ItemEntity[]
  store: RootStore
}

describe(`${OrderItem.displayName}`, () => {
  beforeEach<LocalTestContext>(context => {
    const entities = makeTestOrderEntities()
    const preloadedState: Partial<RootState> = {
      orders: {
        ...initialState,
        orderEntities: orderEntityAdapter.getInitialState({}, entities.orders),
        itemEntities: itemEntityAdapter.getInitialState({}, entities.items),
      },
    }

    const { Fixture, store } = makeComponentFixture({
      preloadedState,
    })
    context.store = store
    context.orders = entities.orders
    context.items = entities.items
    context.Sut = params => (
      <Fixture>
        <OrderItem {...params} />
      </Fixture>
    )
  })

  it<LocalTestContext>("renders item data if supplied ids refer to a existing orderItem", async context => {
    const order0 = context.orders.at(2)!
    const item0 = context.items.find(item => item.id === order0.itemEntityIds.at(1))!

    render(<context.Sut orderId={order0.id} itemId={item0.id} />)

    const idElement = await screen.findByText(`id: ${item0.id}`)
    const productIdElement = await screen.findByText(`productId: ${item0.productId}`)
    const quantityElement = await screen.findByText(`quantity: ${item0.quantity}`)

    expect(idElement).toBeInTheDocument()
    expect(productIdElement).toBeInTheDocument()
    expect(quantityElement).toBeInTheDocument()
  })

  it<LocalTestContext>("renders correct item data if props are changed", async context => {
    const order0 = context.orders.at(1)!
    const order1 = context.orders.at(2)!
    const item00 = context.items.find(item => item.id === order0.itemEntityIds.at(0))!
    const item01 = context.items.find(item => item.id === order1.itemEntityIds.at(1))!

    const { rerender } = render(<context.Sut orderId={order0.id} itemId={item00.id} />)

    rerender(<context.Sut orderId={order1.id} itemId={item01.id} />)

    const idElement = await screen.findByText(`id: ${item01.id}`)
    const productIdElement = await screen.findByText(`productId: ${item01.productId}`)
    const quantityElement = await screen.findByText(`quantity: ${item01.quantity}`)

    expect(idElement).toBeInTheDocument()
    expect(productIdElement).toBeInTheDocument()
    expect(quantityElement).toBeInTheDocument()
  })

  it<LocalTestContext>("renders updated item data when item quantity is updated", async context => {
    const order0 = context.orders.at(2)!
    const item0 = context.items.find(item => item.id === order0.itemEntityIds.at(1))!
    const updatedItem0: ItemEntity = { ...item0, quantity: 9000 }

    const gateway = getOrdersGateway()

    vi.spyOn(gateway, "getOrders").mockResolvedValueOnce({
      orders: context.orders,
      items: context.items,
    })

    const updateOrderSpy = vi.spyOn(gateway, "updateItem").mockResolvedValueOnce()

    vi.spyOn(gateway, "getItem").mockResolvedValueOnce(updatedItem0)

    render(<context.Sut orderId={order0.id} itemId={item0.id} />)

    const quantityElement = await screen.findByText(`quantity: ${item0.quantity}`)

    await act(() =>
      context.store.dispatch(
        updateQuantityByItemId({
          orderId: order0.id,
          itemId: item0.id,
          quantity: updatedItem0.quantity,
        }),
      ),
    )

    const updatedQuantityElement = await screen.findByText(`quantity: ${updatedItem0.quantity}`)

    expect(updateOrderSpy).toHaveBeenCalledWith(
      order0.id,
      item0.id,
      expect.objectContaining({
        quantity: updatedItem0.quantity,
      }),
    )
    expect(quantityElement).toBeInTheDocument()
    expect(updatedQuantityElement).toBeInTheDocument()
  })
})
