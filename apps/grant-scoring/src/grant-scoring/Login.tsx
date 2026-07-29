import React, { useContext, useEffect } from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import { TypographyProps } from '@mui/material/Typography'

import Typography from '@mui/material/Typography'
import { useNavigate} from 'react-router-dom'
import { Alert } from '@mui/material'
import { GetSteps, Login, useGetApplications } from '../helpers/API'
import { ApplicationScoringContext } from '../grant-scoring/AppContextProvider'
import { IToken } from '../grant-scoring/types'


function Copyright(props: TypographyProps) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" target="_blank" href="https://orwa.org/">
                ORWA
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const LoginPage = () => {

    const navigate = useNavigate()
    const {
        setStatus, 
        setToken, 
        setSteps, 
        status, 
        setApplications
    } = useContext(ApplicationScoringContext)

    const [failed, setFailed] = React.useState(false)
    const getApplications = useGetApplications()
    /**
     * Used when the component mounts to login the user with the key
     * as well as when the user submits the form
     * @param key Public Auth Key Token
     */
    const doLogin = (key: string) => {
        
        Login(key).then((s) => {
            if (!s) return setFailed(true)

            // Strapi v5: application_status is a flat relation object (no .data wrapper)
            const statusId = s.application_status?.id as number
            if (!statusId) return setFailed(true)

            setStatus(statusId)
            localStorage.setItem('status', String(statusId))
            setToken(s as IToken)
            localStorage.setItem('token', JSON.stringify(s))

            getApplications(statusId).then((apps) => {
                setApplications(apps)
            })
            setTimeout(() => {
                navigate(`/grant-application-scoring`)
            }, 1000)
        })
    }

    /**
     * Step 1: Auto Login
     * @description Check for ?key= in the URL and call login with it
     */
    useEffect(() => {   
        // reset token and status
        setToken({} as IToken)
        setStatus(0)
        localStorage.removeItem('token')
        localStorage.removeItem('status')
        const urlParams = new URLSearchParams(window.location.search)
        const key = urlParams.get('key')
        if (key) doLogin(key)
    }, [])


    /**
     * Step 2: Populate Context Wrapper
     * @description Get all status' associated with all grant tokens sorted by the order field
     */
    useEffect(() => {
        if (!status) return
        GetSteps().then((s) => {
            if (s.length > 0) setSteps(s)
        })
    }, [status])

    /**
     * Reset Failed Login Timer
     */
    useEffect(() => {
        if (failed) {
            const timer = setTimeout(() => {
                setFailed(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [failed])

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px',
                }}
            >
                <img style={{ marginLeft: 80 }} width="130" height="61" src="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png"
                    className="custom-logo"
                    alt="Oklahoma Rural Water Association"
                    decoding="async"
                    srcSet="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png 130w, https://orwa.org/wp-content/uploads/ORWA-white-300-140x66.png 140w, https://orwa.org/wp-content/uploads/ORWA-white-300.png 300w"
                    sizes="(max-width: 130px) 100vw, 130px"
                />

                <Typography component="h1" variant="h6">
                    ORWA GApp Eval
                </Typography>
                <Box component="form" onSubmit={
                    (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()

                        const data = new FormData(event.currentTarget)
                        const key: string = data.get('password') as string ?? ''

                        if (key !== '') doLogin(key)
                    }
                } noValidate sx={{ mt: 1 }}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {failed && <Alert severity="error">Key Not Found.</Alert>}
                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 30 }} />
        </>
    )
}

export default LoginPage