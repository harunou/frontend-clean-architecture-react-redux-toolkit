import { Orders } from "../orders"
import "./App.css"
import logo from "./logo.svg"

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Orders />
      </header>
    </div>
  )
}

export default App
