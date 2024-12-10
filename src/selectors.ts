import { type AppSliceState } from "./features/app/appSlice"
import { type OrdersSliceState } from "./features/orders/types"
import type { RootState } from "./stores/rootStore.types"

export const selectOrderSliceState = (state: RootState): OrdersSliceState => state.orders
export const selectAppSliceState = (state: RootState): AppSliceState => state.app
