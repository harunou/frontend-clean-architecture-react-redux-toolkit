import { render, screen } from "@testing-library/react"
import App from "./App"
import { makeComponentFixture } from "../../utils/testing/makeComponentFixture"
import { HybridOrdersGateway } from "../orders/gateways"
import { type FC } from "react"
import {
  deleteItemButtonTestId,
  deleteOrderButtonTestId,
  orderItemTestId,
  orderTestId,
} from "../orders/views/testIds"
import { makeTestOrderEntities } from "../orders/utils/testing"
import { test, vi } from "vitest"

test("delete order button deletes an order with items", async () => {
  const entities = makeTestOrderEntities()
  const gateway = HybridOrdersGateway.make()
  vi.spyOn(gateway, "getOrders").mockResolvedValueOnce(entities)
  vi.spyOn(gateway, "deleteOrder").mockResolvedValueOnce()

  const { Fixture, user } = makeComponentFixture()
  const Sut: FC = () => (
    <Fixture>
      <App />
    </Fixture>
  )

  render(<Sut />)

  expect(await screen.findAllByTestId(orderTestId)).toHaveLength(3)
  expect(await screen.findAllByTestId(orderItemTestId)).toHaveLength(6)

  const deleteButtons = await screen.findAllByTestId(deleteOrderButtonTestId)
  await user.click(deleteButtons[0])

  expect(await screen.findAllByTestId(orderTestId)).toHaveLength(2)
  expect(await screen.findAllByTestId(orderItemTestId)).toHaveLength(4)
})

test("delete item button deletes one item in an order", async () => {
  const entities = makeTestOrderEntities()
  const gateway = HybridOrdersGateway.make()
  vi.spyOn(gateway, "getOrders").mockResolvedValueOnce(entities)
  vi.spyOn(gateway, "deleteItem").mockResolvedValueOnce()

  const { Fixture, user } = makeComponentFixture()
  const Sut: FC = () => (
    <Fixture>
      <App />
    </Fixture>
  )

  render(<Sut />)

  expect(await screen.findAllByTestId(orderTestId)).toHaveLength(3)
  expect(await screen.findAllByTestId(orderItemTestId)).toHaveLength(6)

  const deleteButtons = await screen.findAllByTestId(deleteItemButtonTestId)
  await user.click(deleteButtons[0])

  expect(await screen.findAllByTestId(orderTestId)).toHaveLength(3)
  expect(await screen.findAllByTestId(orderItemTestId)).toHaveLength(5)
})
