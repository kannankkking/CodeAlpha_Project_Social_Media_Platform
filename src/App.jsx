import Pages from "./components/Pages/Pages"
import { BrowserRouter } from "react-router-dom"
import AppContext from "./components/AppContext/AppContext";
function App() {

  return (
    <>
   <h1 className='App'>
   <BrowserRouter>
   <AppContext>
   <Pages></Pages>
   </AppContext>
   </BrowserRouter>
  </h1>
    </>
  )
}

export default App
