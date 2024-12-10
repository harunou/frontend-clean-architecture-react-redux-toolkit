import type { FC } from "react"
import { memo, useEffect } from "react"
import { ordersTestId, totalItemQuantityTestId } from "../../testIds"
import { Order } from "../Order/Order"
import { useController, usePresenter } from "./hooks"

export const Orders: FC = memo(function Orders() {
  const presenter = usePresenter()
  const controller = useController()

  useEffect(() => {
    controller.moduleStarted()
    return () => controller.moduleDestroyed()
  }, [controller])

  return (
    <div data-testid={ordersTestId}>
      <div>Orders</div>
      <div>
        Total Items Quantity:{" "}
        <span data-testid={totalItemQuantityTestId}>{presenter.totalItemsQuantity}</span>
      </div>
      <div>Status: {presenter.isLoading ? "loading..." : "pending"}</div>
      {presenter.orderIds.map(orderId => (
        <Order key={orderId} orderId={orderId} />
      ))}
    </div>
  )
})

Orders.displayName = "Orders"
