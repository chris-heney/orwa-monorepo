import "./App.css"
import AppContext from "./providers/AppContext"
import LoginModal from "./components/LoginModal"
import DefaultLayout from "./layouts/DefaultLayout"
import MapContextProvider from "./providers/MapContext"

const App = () => {


  return (
    <>
      <AppContext>
        <LoginModal />
        <MapContextProvider>
          <DefaultLayout />
        </MapContextProvider>
      </AppContext>
    </>
  )
}

export default App
