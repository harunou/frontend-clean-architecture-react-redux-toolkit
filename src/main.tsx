import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import "./main.css"
import App from "./features/app/App"
import { makeRootStore } from "./stores/makeRootStore"

const container = document.getElementById("root")

if (container) {
  const rootStore = makeRootStore()
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={rootStore}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
