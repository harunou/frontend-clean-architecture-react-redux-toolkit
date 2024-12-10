import { makeRootSlice } from "../../utils"

export interface AppSliceState {
  interactions: number
}

const initialState: AppSliceState = {
  interactions: 0,
}

export const appSlice = makeRootSlice({
  name: "app",
  initialState,
  reducers: {},
})
