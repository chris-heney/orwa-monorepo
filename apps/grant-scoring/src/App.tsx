// App.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Route, Routes, HashRouter } from 'react-router-dom'
import './App.css';
import Header from './grant-scoring/components/Header'
import { containerClass } from './helpers/utilities'
import Footer from './grant-scoring/components/Footer'
import { Box } from '@mui/material'
import GrantApplicationScoring from './grant-scoring/GrantApplicationScoring'
import LoginPage from './Login'
import StickyHeader from './grant-scoring/components/StickyHeader'
import AppContextProvider from './grant-scoring/helpers/AppContextProvider'

function App() {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 300,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  })


  return (
    <HashRouter>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <StickyHeader />
          <Box className={`${containerClass} App text-xl`}>
            <Routes>
              <Route path={'/'} element={<LoginPage />} />
              <Route path={'/grant-directory'} element={<GrantApplicationScoring />} />
            </Routes>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Footer />
        </ThemeProvider>
      </AppContextProvider>
    </HashRouter>
  )
}

export default App