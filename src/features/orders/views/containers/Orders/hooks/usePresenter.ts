import { useMemo } from "react"
import { useSelector } from "../../../../../../hooks/useSelector"
import type { Presenter } from "../Orders.types"
import { orderEntitySelectors, totalOrderItemQuantitySelector } from "../../../selectors"

export const usePresenter = (): Presenter => {
  const orders = useSelector(store => orderEntitySelectors.selectAll(store.orders))
  const orderIds = useMemo(() => {
    return orders.map(o => o.id)
  }, [orders])
  const totalItemsQuantity = useSelector(totalOrderItemQuantitySelector)
  const isLoading = useSelector(state => state.orders.orderPresentation.isLoading)

  return useMemo(
    () => ({
      orderIds,
      isLoading: isLoading,
      totalItemsQuantity,
    }),
    [isLoading, orderIds, totalItemsQuantity],
  )
}
