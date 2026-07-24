import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import AppContext from "./providers/AppContext"
import LoginModal from "./components/LoginModal"
import DefaultLayout from "./layouts/DefaultLayout"
import MapContextProvider from "./providers/MapContext"
import { muiTheme } from "./theme/muiTheme"

const App = () => {

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppContext>
        <LoginModal />
        <MapContextProvider>
          <DefaultLayout />
        </MapContextProvider>
      </AppContext>
    </ThemeProvider>
  )
}

export default App
