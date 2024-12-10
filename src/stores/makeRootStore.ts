import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { appSlice } from "../features/app/appSlice"
import { ordersSlice, ordersSnapshotLoggerMiddleware } from "../features/orders"
import type { RootState } from "./rootStore.types"

const makeRootReducer = () => {
  // `combineSlices` automatically combines the reducers using
  // their `reducerPath`s, therefore we no longer need to call `combineReducers`.
  return combineSlices(appSlice, ordersSlice)
}

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeRootStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: makeRootReducer(),
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(ordersSnapshotLoggerMiddleware),
  })
  return store
}
