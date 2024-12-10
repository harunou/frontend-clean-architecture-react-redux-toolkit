import {
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  useSelector as useUntypedSelector,
  type TypedUseSelectorHook,
} from "react-redux"
import type { RootState } from "../stores/rootStore.types"

export const useSelector: TypedUseSelectorHook<RootState> = useUntypedSelector
