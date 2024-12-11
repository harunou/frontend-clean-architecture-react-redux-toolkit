import { render, screen } from "@testing-library/react"
import { type FC } from "react"
import { describe, it, expect } from "vitest"
import { output } from "../../../../../utils/testing"
import { totalOrderItemQuantitySelector } from "./totalQuantitySelector"
import { itemEntityAdapter, orderEntityAdapter, ordersInitialState } from "../../../slice"
import { makeTestOrderEntities } from "../../../utils/testing"
import { useSelector } from "../../../../../hooks/useSelector"
import { makeComponentFixture } from "../../../../../utils/testing/makeComponentFixture"
import type { RootState } from "../../../../../stores/rootStore.types"
import type { ItemEntity } from "../../../types"

const outputTestId = "output-test-id"

interface LocalTestContext {
  Sut: FC
  items: ItemEntity[]
}

interface Output {
  quantity: number
}

describe(`${totalOrderItemQuantitySelector.name}`, () => {
  beforeEach<LocalTestContext>(context => {
    const entities = makeTestOrderEntities()
    const preloadedState: Partial<RootState> = {
      orders: {
        ...ordersInitialState,
        orderEntities: orderEntityAdapter.getInitialState({}, entities.orders),
        itemEntities: itemEntityAdapter.getInitialState({}, entities.items),
      },
    }

    const { Fixture } = makeComponentFixture({
      preloadedState,
    })
    const Output: FC = () => {
      const quantity = useSelector(store => totalOrderItemQuantitySelector(store))
      return <div data-testid={outputTestId}>{output<Output>({ quantity })}</div>
    }
    context.items = entities.items
    context.Sut = () => (
      <Fixture>
        <Output />
      </Fixture>
    )
  })

  it<LocalTestContext>("returns the total quantity of items in the store", context => {
    const expectedTotalQuantity = context.items.reduce((acc, item) => acc + item.quantity, 0)
    render(<context.Sut />)

    expect(screen.getByTestId(outputTestId)).toHaveOutput<Output>({
      quantity: expectedTotalQuantity,
    })
  })
})
