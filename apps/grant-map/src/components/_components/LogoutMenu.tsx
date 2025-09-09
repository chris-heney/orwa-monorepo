import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const LogoutMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    return (
        <>
            <Button
                size={'medium'}
                color="inherit"
                aria-label="open drawer"
                aria-controls="counties-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
            >
                <SettingsIcon
                />
            </Button>
            <Menu
                id="counties-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    maxHeight: 400
                }}
            >
                {/* logout */}
                {/* 
                reset the local storage
                 localStorage.setItem('jwt', credentials.jwt)
    localStorage.setItem('user', JSON.stringify(credentials.user))
                 */}
                <MenuItem onClick={() => {
                    localStorage.removeItem('jwt')
                    localStorage.removeItem('user')
                    window.location.reload()
                }}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    )
}

export default LogoutMenu
