import * as React from 'react'
import { useMediaQuery, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'

export const TopToolbar = (props: ToolbarProps) => {
  const isXSmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('sm')
  )

  return (
    <StyledToolbar
      disableGutters
      variant={isXSmall ? 'regular' : 'dense'}
      {...sanitizeToolbarRestProps(props)}
    />
  )
}

TopToolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

const PREFIX = 'RaTopToolbar'

const StyledToolbar = styled(Toolbar, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root
})(({ theme }) => ({
  position: 'sticky',
  right: 0,
  top: 0,
  zIndex: 11,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  whiteSpace: 'nowrap',
  flex: '0 1 auto',
  padding: 0,
  margin: 0,
  backgroundColor: 'inherit',
  minHeight: 'unset',
  [theme.breakpoints.down('md')]: {
    flex: '0 1 100%'
  },
  [theme.breakpoints.down('sm')]: {
    backgroundColor: theme.palette.background.paper,
    padding: 0,
    margin: 0,
  }
}))

const sanitizeToolbarRestProps = ({ ...props }: ToolbarProps) => props

export default TopToolbar
