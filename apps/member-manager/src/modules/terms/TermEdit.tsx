import React from 'react'
import { Edit, useNotify } from 'react-admin'
import TermForm from './TermForm'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const TermEdit = () => {
  const notify = useNotify()

  return (
    <Edit
      title="Edit Term"
      component="div"
      redirect="list"
      transform={(data) => ({
        ...data,
        slug: data.slug || slugify(String(data.title || '')),
        identifiers: Array.isArray(data.identifiers) ? data.identifiers : [],
      })}
      mutationOptions={{
        onSuccess: () => {
          notify('Term saved', { type: 'success' })
        },
      }}
    >
      <TermForm />
    </Edit>
  )
}

export default TermEdit
