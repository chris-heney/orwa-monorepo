import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'
import IContact, { ApplicationScoringContextProvider, IGrantApplication, IToken, Identifier, StepData } from './types'
import { GetSteps, useGetApplications, useGetScore, useGetStatus } from '../helpers/API'
import authProvider from '../helpers/Auth'


export const ApplicationScoringContext = createContext<ApplicationScoringContextProvider>({
    user: {} as IContact,
    setUser: () => { },
    applications: [],
    setApplications: () => { },
    applicationIndex: 0,
    setApplicationIndex: () => { },
    score: 0,
    setScore: () => { },
    token: {} as IToken,
    setToken: () => { },
    steps: [],
    setSteps: () => { },
    status: 0,
    setStatus: () => { },
    notApprovedId: 0,
    identity: {},
    setIdentity: () => { },
})

const AppContextProvider = ({ children }: PropsWithChildren) => {

    const [user, setUser] = useState<IContact>({} as IContact)
    const [applications, setApplications] = useState<IGrantApplication[]>([])
    const [applicationIndex, setApplicationIndex] = useState<number>(0)
    const [score, setScore] = useState<number>(0)
    const [token, setToken] = useState<IToken>(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') as string) : {} as IToken)
    const [steps, setSteps] = useState<StepData[]>([])
    const [status, setStatus] = useState<Identifier>(localStorage.getItem('status') ? parseInt(localStorage.getItem('status') as string) : 0)
    const [notApprovedId, setNotApprovedId] = useState<Identifier>(0)
    const [identity, setIdentity] = React.useState<any>({})

    const getScore = useGetScore()
    const getApplications = useGetApplications()
    const getStatus = useGetStatus()
    // const navigate = useNavigate()

    useEffect(() => {
        getApplications(status).then(apps => {
            if (!apps) return
            setApplications(apps)
        })
        getStatus('Not Approved').then((status) => {
            setNotApprovedId(status)
        })

        authProvider.getIdentity().then(data => {
            setIdentity(data)
        })
    
    }, [])

    // If Application Index changes, get the score of the new application

    useEffect(() => {

        if (applications.length === 0) return

        getScore(applications[applicationIndex].id as number).then((score) => {
            setScore(score)
        })
    }, [applicationIndex, applications])

    // Get the steps when the re component mounts

    useEffect(() => {
        if (status === 0) return
        GetSteps().then((s) => {
            if (s.length > 0) setSteps(s)
        })
    }, [])

    return (
        <ApplicationScoringContext.Provider
            value={{
                user,
                setUser,
                applications,
                setApplications,
                applicationIndex,
                setApplicationIndex,
                score,
                setScore,
                token,
                setToken,
                steps,
                setSteps,
                status,
                setStatus,
                notApprovedId: notApprovedId,
                identity,
                setIdentity
            }}>
            {children}
        </ApplicationScoringContext.Provider>
    )
}

export default AppContextProvider