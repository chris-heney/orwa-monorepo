import './App.css'
import ConferenceKioskContextProvider from './ConferenceKioskContextProvider'
import ConferenceKiosk from './ConferenceKiosk'
import LoginModal from './components/LoginModal'

function App() {

  return (
    <ConferenceKioskContextProvider>
      <LoginModal/>
      <ConferenceKiosk/>
    </ConferenceKioskContextProvider>
  )
}

export default App
