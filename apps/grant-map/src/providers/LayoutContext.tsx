import React, { createContext, useContext, useState, PropsWithChildren } from "react"

interface LayoutContextProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useAppContext must be used within a LayoutContextProvider")
  }
  return context
}

const LayoutContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutContextProvider