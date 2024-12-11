import { render, screen } from "@testing-library/react"
import { type FC } from "react"
import { describe, it, expect } from "vitest"
import { output } from "../../../../../utils/testing"
import {
  type OrderEntityId,
  type ItemEntityId,
  type OrderEntity,
  type ItemEntity,
} from "../../../types"
import { ordersInitialState, orderEntityAdapter, itemEntityAdapter } from "../../../slice"
import { makeOrderEntityId, makeItemEntityId } from "../../../utils"
import { itemByIdSelector } from "./itemByIdSelector"
import { makeTestOrderEntities } from "../../../utils/testing"
import { useSelector } from "../../../../../hooks/useSelector"
import { makeComponentFixture } from "../../../../../utils/testing/makeComponentFixture"
import { type RootState } from "../../../../../stores/rootStore.types"

const outputTestId = "output-test-id"

interface LocalTestContext {
  Sut: FC<{ orderId: OrderEntityId; itemId: ItemEntityId }>
  orders: OrderEntity[]
  items: ItemEntity[]
}

interface Output {
  item: ItemEntity | null
}

describe(`${itemByIdSelector.name}`, () => {
  beforeEach<LocalTestContext>(context => {
    const entities = makeTestOrderEntities()
    const preloadedState: Partial<RootState> = {
      orders: {
        ...ordersInitialState,
        orderEntities: orderEntityAdapter.getInitialState({}, entities.orders),
        itemEntities: itemEntityAdapter.getInitialState({}, entities.items),
      },
    }
    const { Fixture } = makeComponentFixture({ preloadedState })
    const Output: FC<{
      orderId: OrderEntityId
      itemId: ItemEntityId
    }> = params => {
      const item = useSelector(store => itemByIdSelector(store, params.orderId, params.itemId))
      return (
        <div data-testid={outputTestId}>
          {output<Output>({
            item: item ?? null,
          })}
        </div>
      )
    }
    context.orders = entities.orders
    context.items = entities.items
    context.Sut = params => (
      <Fixture>
        <Output {...params} />
      </Fixture>
    )
  })

  it<LocalTestContext>("returns the item with the specified ID", ({ Sut, orders, items }) => {
    const order = orders.at(2)!
    const item = items.find(item => item.id === order.itemEntityIds.at(1)!)!

    render(<Sut orderId={order.id} itemId={item.id} />)

    expect(screen.getByTestId(outputTestId)).toHaveOutput<Output>({
      item: item,
    })
  })

  it<LocalTestContext>("returns undefined if the order or item does not exist", context => {
    render(
      <context.Sut
        orderId={makeOrderEntityId("non-existent")}
        itemId={makeItemEntityId("non-existent")}
      />,
    )

    expect(screen.getByTestId(outputTestId)).toHaveOutput<Output>({
      item: null,
    })
  })

  it<LocalTestContext>("returns undefined if the item is not associated with the specified order", context => {
    const order = context.orders.at(1)!
    const item = context.items.find(item => item.id === order.itemEntityIds.at(1)!)!
    const { rerender } = render(
      <context.Sut orderId={order.id} itemId={makeItemEntityId("non-existent")} />,
    )
    const result0 = screen.getByTestId(outputTestId)

    rerender(<context.Sut orderId={makeOrderEntityId("non-existent")} itemId={item.id} />)
    const result1 = screen.getByTestId(outputTestId)

    expect(result0).toHaveOutput<Output>({
      item: null,
    })
    expect(result1).toHaveOutput<Output>({
      item: null,
    })
  })
})
