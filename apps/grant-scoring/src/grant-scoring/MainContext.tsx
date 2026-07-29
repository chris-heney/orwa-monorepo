import React, { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react'
import { IGrantApplication } from './types'


export interface StepData {
  id: number            // Token ID
  statusId: number      // Status ID
  color: string
  description: string
  label: string
  name: string
  order: number
  updatedAt?: string
  createdAt?: string
}

export interface MainContextData {
  application: IGrantApplication | null
  applications: IGrantApplication[]
  applicationIndex: number
  setMainContextData: Dispatch<SetStateAction<MainContextData>>
  isLoading: boolean
  score: number
  status: number | null
  steps: StepData[]
  token: any
}

export const MainContext = createContext<Partial<MainContextData>>({})

export const useMainContext = () => {
  const context = useContext(MainContext)
  if (!context) {
    throw new Error('useMainContext must be used within a MainContextProvider')
  }
  return context as MainContextData;
}

export const MainContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [mainContextData, setMainContextData] = useState<MainContextData>({
    application: null,
    applications: [],
    applicationIndex: 0,
    setMainContextData: () => { },
    isLoading: true,
    score: 0,
    status: null,
    steps: [],
    token: null
  })

  useEffect(() => {
    const storedData = localStorage.getItem('mainContextData')
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      try {
   
        setMainContextData((prevData) => ({
          ...prevData,
          application: parsedData.applications[parsedData.applicationIndex],
          applications: parsedData.applications,
          applicationIndex: parsedData.applicationIndex,
          status: parsedData.status,
          token: parsedData.token,
          steps: parsedData.steps,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error parsing stored data:', error)
        setMainContextData((prevData) => ({
          ...prevData,
          isLoading: false,
        }))
      }
    } else {
      setMainContextData((prevData) => ({
        ...prevData,
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    if (mainContextData.isLoading) return

    localStorage.setItem('mainContextData', JSON.stringify(mainContextData))

  }, [mainContextData]);

  const updateMainContextData = (newData: SetStateAction<MainContextData>) => {
    setMainContextData((prevData) => {

      const updatedData = typeof newData === 'function' ? newData(prevData) : newData;
      localStorage.setItem('mainContextData', JSON.stringify({ ...prevData, ...updatedData }))

      return { ...prevData, ...updatedData }
    })
  }

  return (
    <MainContext.Provider value={{ ...mainContextData, setMainContextData: updateMainContextData }}>
      {children}
    </MainContext.Provider>
  )
}
