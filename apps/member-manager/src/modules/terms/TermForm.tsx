import React, { useEffect, useRef } from 'react'
import { SimpleForm, TextInput, required, useInput } from 'react-admin'
import { RichTextInput } from 'ra-input-rich-text'
import { useFormContext, useWatch } from 'react-hook-form'
import { Box, Card } from '@mui/material'
import IdentifiersInput from './IdentifiersInput'
import CustomFormHeader from '../_components/CustomFormHeader'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const SlugFromTitle = () => {
  const title = useWatch({ name: 'title' })
  const { setValue } = useFormContext()
  const { field } = useInput({ source: 'slug' })
  const touched = useRef(!!field.value)

  useEffect(() => {
    if (touched.current) return
    if (typeof title === 'string' && title.trim()) {
      setValue('slug', slugify(title), { shouldDirty: false })
    }
  }, [title, setValue])

  return (
    <TextInput
      source="slug"
      label="Slug"
      fullWidth
      helperText="Auto-generated from title (WordPress-style); edit to override"
      onChange={() => {
        touched.current = true
      }}
      parse={(v) => (typeof v === 'string' ? slugify(v) : v)}
    />
  )
}

const TermForm = () => {
  return (
    <Card sx={{ m: 2 }}>
      <SimpleForm sx={{ p: 0 }}>
        <CustomFormHeader
          redirectTo="/terms"
          displayField="title"
          hasShow={false}
        />
        <Box sx={{ px: 2, py: 1, width: '100%' }}>
          <TextInput
            source="title"
            label="Title"
            fullWidth
            validate={required('Title is required')}
            helperText="Modal header shown to the user"
          />
          <SlugFromTitle />
          <IdentifiersInput source="identifiers" />
          <RichTextInput
            source="content"
            label="Content"
            fullWidth
            validate={required('Content is required')}
          />
        </Box>
      </SimpleForm>
    </Card>
  )
}

export default TermForm
