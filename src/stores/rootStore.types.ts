import type {
  EnhancedStore,
  UnknownAction,
  Tuple,
  StoreEnhancer,
  ThunkDispatch,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit"
import type { AppSliceState } from "../features/app/appSlice"
import type { OrdersSliceState } from "../features/orders/types"

export type RootState = {
  app: AppSliceState
  orders: OrdersSliceState
}

export type RootStore = EnhancedStore<
  RootState,
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{
        dispatch: ThunkDispatch<RootState, unknown, UnknownAction>
      }>,
      StoreEnhancer,
    ]
  >
>
export type RootDispatch = RootStore["dispatch"]
export type RootThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
