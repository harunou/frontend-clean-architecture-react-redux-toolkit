import userEvent from "@testing-library/user-event"
import type { FC, PropsWithChildren } from "react"
import { Provider } from "react-redux"
import type { RootState, RootStore } from "../../stores/rootStore.types"
import { makeRootStore } from "../../stores/makeRootStore"

/**
 * This type extends the default options for
 * React Testing Library's render function. It allows for
 * additional configuration such as specifying an initial Redux state and
 * a custom store instance.
 */
interface ExtendedRenderOptions {
  /**
   * Defines a specific portion or the entire initial state for the Redux store.
   * This is particularly useful for initializing the state in a
   * controlled manner during testing, allowing components to be rendered
   * with predetermined state conditions.
   */
  preloadedState?: Partial<RootState>

  /**
   * Allows the use of a specific Redux store instance instead of a
   * default or global store. This flexibility is beneficial when
   * testing components with unique store requirements or when isolating
   * tests from a global store state. The custom store should be configured
   * to match the structure and middleware of the store used by the application.
   *
   * @default makeStore(preloadedState)
   */
  store?: RootStore
}

export const makeComponentFixture = (extendedRenderOptions: ExtendedRenderOptions = {}) => {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeRootStore(preloadedState),
  } = extendedRenderOptions

  const Fixture: FC<PropsWithChildren<unknown>> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    user: userEvent.setup(),
    Fixture,
  }
}
