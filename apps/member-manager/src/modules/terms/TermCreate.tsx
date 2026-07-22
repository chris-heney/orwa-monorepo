import React from 'react'
import { Create, useNotify, useRedirect } from 'react-admin'
import TermForm from './TermForm'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const TermCreate = () => {
  const notify = useNotify()
  const redirect = useRedirect()

  return (
    <Create
      title="Create Term"
      component="div"
      transform={(data) => ({
        ...data,
        slug: data.slug || slugify(String(data.title || '')),
        identifiers: Array.isArray(data.identifiers) ? data.identifiers : [],
      })}
      mutationOptions={{
        onSuccess: () => {
          notify('Term created', { type: 'success' })
          redirect('list', 'terms')
        },
      }}
    >
      <TermForm />
    </Create>
  )
}

export default TermCreate
