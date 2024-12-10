import { makeRootSlice } from "../../../utils"
import {
  attachDeleteItemByIdCases,
  attachDeleteOrderByIdCases,
  attachLoadOrdersCases,
  attachUpdateQuantityByItemIdCases,
} from "../thunks"
import type { OrdersSliceState } from "../types"
import { itemEntityAdapter, orderEntityAdapter } from "../entities"

export const initialState: OrdersSliceState = {
  orderEntities: orderEntityAdapter.getInitialState(),
  itemEntities: itemEntityAdapter.getInitialState(),
  orderPresentation: {
    isLoading: false,
  },
}

export const ordersSlice = makeRootSlice({
  name: "orders",
  initialState,
  reducers: () => ({}),
  extraReducers: builder => {
    attachDeleteOrderByIdCases(builder)
    attachDeleteItemByIdCases(builder)
    attachUpdateQuantityByItemIdCases(builder)
    attachLoadOrdersCases(builder)
  },
})
