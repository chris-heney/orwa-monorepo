import React, { useContext, useEffect } from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import { TypographyProps } from '@mui/material/Typography'

import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
import { FindApplication } from './helpers/API'
import { DirectoryContext } from './grant-scoring/helpers/AppContextProvider'


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
    
   const {setApplications, applications} = useContext(DirectoryContext)

    const [failed, setFailed] = React.useState(false)

    /**
     * Used when the component mounts to login the user with the key
     * as well as when the user submits the form
     * @param key Public Auth Key Token
     */
    const doFindApplications = (application_id: string) => {
        FindApplication(application_id).then((s) => {
            if (!s) return setFailed(true)
            setApplications(s.applications.data)
        })
    }

    /**
     * Step 1: Auto Login
     * @description Check for ?key= in the URL and call login with it
     */
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const email = urlParams.get('email')
        if (email) doFindApplications(email)
    }, [])


    /**
     * Step 2: Populate Context Wrapper
     * @description Get all status' associated with all grant tokens sorted by the order field
     */
    /**
     * Step 3: Set Main Context & Redirect
     */
    useEffect(() => {
        if (applications.length > 0) {
            navigate('/grant-directory')
        }
    }, [applications])
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
                   Enter Your Registration Email
                </Typography>
                <Box component="form" onSubmit={
                    (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()

                        const data = new FormData(event.currentTarget)
                        const email: string = data.get('email') as string ?? ''

                        if (email !== '') doFindApplications(email)
                    }
                } noValidate sx={{ mt: 1 }}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Application Id"
                        type="text"
                        id="email"
                        autoComplete="current-password"
                    />
                    {failed && <Alert severity="error">Application Not Found.</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Find Application
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 30 }} />
        </>
    )
}

export default LoginPage