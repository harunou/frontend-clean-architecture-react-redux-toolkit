import type { FC } from "react"
import { memo } from "react"
import type { OrderParams } from "./Order.types"
import { OrderItem } from "../OrderItem"
import { deleteOrderButtonTestId, orderTestId } from "../../testIds"
import { useController, usePresenter } from "./hooks"

export const Order: FC<OrderParams> = memo(params => {
  const presenter = usePresenter(params.orderId)
  const controller = useController(params.orderId)

  if (!presenter.hasOrder) {
    return null
  }

  return (
    <div
      style={{
        border: "1px solid red",
        marginBottom: `${presenter.isLastOrder ? "0px" : "3px"}`,
        padding: "5px",
      }}
      data-testid={orderTestId}
    >
      <button data-testid={deleteOrderButtonTestId} onClick={controller.deleteOrderButtonClicked}>
        Delete Order
      </button>
      <div>OrderId: {presenter.orderId}</div>
      <div>User: {presenter.userId}</div>
      <div>
        <div>Items:</div>
        {presenter.itemIds.map(itemId => (
          <OrderItem key={itemId} orderId={params.orderId} itemId={itemId} />
        ))}
      </div>
    </div>
  )
})

Order.displayName = "Order"
