import React, { useEffect, useRef } from 'react'
import {
  DeleteButton,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useInput,
} from 'react-admin'
import { RichTextInput } from 'ra-input-rich-text'
import { useFormContext, useWatch } from 'react-hook-form'
import { Box } from '@mui/material'
import { formSectionCardSx } from '../../css/formLayout'
import IdentifiersInput from './IdentifiersInput'
import CustomFormHeader from '../_components/CustomFormHeader'

const TermToolbar = () => (
  <Toolbar
    sx={{
      bgcolor: 'background.paper',
      color: 'text.primary',
      borderTop: 1,
      borderColor: 'divider',
      justifyContent: 'space-between',
    }}
  >
    <SaveButton variant="contained" />
    <DeleteButton />
  </Toolbar>
)

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

const richTextSx = {
  width: '100%',
  '& .RaRichTextInputToolbar-root': {
    color: 'text.primary',
  },
  '& .RaRichTextInput-editorContent .ProseMirror': {
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderColor: 'divider',
    minHeight: 220,
  },
  '& .RaRichTextInput-editorContent .ProseMirror:hover': {
    bgcolor: 'action.hover',
  },
  '& .RaRichTextInput-editorContent .ProseMirror:focus': {
    bgcolor: 'background.paper',
  },
}

const TermForm = () => {
  return (
    <>
      <SimpleForm sx={{ p: 0, m: 0 }} toolbar={<TermToolbar />}>
        <CustomFormHeader
          redirectTo="/terms"
          displayField="title"
          hasShow={false}
        />
        <Box sx={{ ...formSectionCardSx, width: '100%' }}>
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
            sx={richTextSx}
          />
        </Box>
      </SimpleForm>
    </>
  )
}

export default TermForm
