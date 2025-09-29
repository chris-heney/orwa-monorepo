import * as React from 'react'
import ContentAdd from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { isEqual, merge } from 'lodash'
import PropTypes from 'prop-types'
import { useResourceContext, useCreatePath } from 'ra-core'
import { Link, To } from 'react-router-dom'

import { Button, ButtonProps, LocationDescriptor } from 'react-admin'

/**
 * Opens the Create view of a given resource
 *
 * Renders as a regular button on desktop, and a Floating Action Button
 * on mobile.
 *
 * @example // basic usage
 * import { CreateButton } from 'react-admin';
 *
 * const CommentCreateButton = () => (
 *     <CreateButton label="Create comment" />
 * );
 */
const CreateButton = (props: CreateButtonProps) => {
  const {
    className,
    icon = defaultIcon,
    label = 'ra.action.create',
    scrollToTop = true,
    variant,
    to: locationDescriptor,
    state: initialState = {},
    ...rest
  } = props
  const resource = useResourceContext(props)
  const createPath = useCreatePath()
  const state = merge(scrollStates.get(String(scrollToTop)), initialState)
  // Duplicated behaviour of Button component (legacy use) which will be removed in v5.
  const linkParams = getLinkParams(locationDescriptor)
  return (
    <StyledButton
      component={Link}
      to={createPath({ resource, type: 'create' })}
      state={state}
      className={clsx(CreateButtonClasses.root, className)}
      label={label}
      variant={variant}
      {...(rest)}
      {...linkParams}
    >
      {icon}
    </StyledButton>
  )
}

// avoids using useMemo to get a constant value for the link state
const scrollStates = new Map([
  ['true', { _scrollToTop: true }],
  ['false', {}],
])

const defaultIcon = <ContentAdd />

interface Props {
  resource?: string
  icon?: React.ReactElement
  scrollToTop?: boolean
  to?: LocationDescriptor | To
}

export type CreateButtonProps = Props & Omit<ButtonProps<typeof Link>, 'to'>

CreateButton.propTypes = {
  resource: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string,
}

const PREFIX = 'RaCreateButton'

export const CreateButtonClasses = {
  root: `${PREFIX}-root`,
  floating: `${PREFIX}-floating`,
}

const StyledButton = styled(Button, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})({})

export default React.memo(CreateButton, (prevProps, nextProps) => {
  return (
    prevProps.resource === nextProps.resource &&
      prevProps.label === nextProps.label &&
      prevProps.translate === nextProps.translate &&
      prevProps.disabled === nextProps.disabled &&
      isEqual(prevProps.to, nextProps.to)
  )
})
    

const getLinkParams = (locationDescriptor?: LocationDescriptor | string) => {
// eslint-disable-next-line eqeqeq
  if (locationDescriptor == undefined) {
    return undefined
  }

  if (typeof locationDescriptor === 'string') {
    return { to: locationDescriptor }
  }

  const { redirect, replace, state, ...to } = locationDescriptor
  return {
    to,
    redirect,
    replace,
    state,
  }
}

