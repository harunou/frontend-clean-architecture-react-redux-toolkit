import { makeRootSlice } from "../../../utils"
import {
  attachDeleteItemByIdCases,
  attachDeleteOrderByIdCases,
  attachLoadOrdersCases,
  attachUpdateQuantityByItemIdCases,
} from "./thunks"
import type { OrdersSliceState } from "../types"
import { itemEntityAdapter, orderEntityAdapter } from "./entities"

export const ordersInitialState: OrdersSliceState = {
  orderEntities: orderEntityAdapter.getInitialState(),
  itemEntities: itemEntityAdapter.getInitialState(),
  orderPresentation: {
    isLoading: false,
  },
}

export const ordersSlice = makeRootSlice({
  name: "orders",
  initialState: ordersInitialState,
  reducers: () => ({}),
  extraReducers: builder => {
    attachDeleteOrderByIdCases(builder)
    attachDeleteItemByIdCases(builder)
    attachUpdateQuantityByItemIdCases(builder)
    attachLoadOrdersCases(builder)
  },
})
