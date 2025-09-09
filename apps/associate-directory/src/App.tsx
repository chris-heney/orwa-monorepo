import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import Associates from './components/Associates'
import Header from './components/Header'
import Filter from './components/Filter'
import { useState } from 'react'
import { IAssociates } from './components/AssociatesInterface'
import { containerClass } from './helpers/utilities'
import Footer from './components/Footer'

function App() {
  const [letterFilter, setLetterFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [associates, setAssociates] = useState<IAssociates[]>([])

  // Create a custom MUI theme
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div className={`${containerClass} App text-xl`}>
        <Filter setLetterFilter={setLetterFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
        <Associates letterFilter={letterFilter} categoryFilter={categoryFilter} setAssociates={setAssociates} associates={associates} />
      </div>
      <Footer />
    </ThemeProvider>
  )
}

export default App
