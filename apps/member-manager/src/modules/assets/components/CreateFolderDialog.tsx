import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { BucketSelector } from './BucketSelector'
import { useAssetProvider } from '../context/AssetProvider'
import { useNotify, useRefresh } from 'react-admin'
import { config } from '../../../config'
import { clearResourceCache } from '../../../dataProvider/ciWebServices'

interface Props {
  open: boolean
  onClose: () => void
  buckets: { name: string }[]
  onRefreshBuckets: () => void
  onCreateBucket: (name: string) => Promise<void> | void
}

export const CreateFolderDialog: React.FC<Props> = ({ open, onClose, buckets, onRefreshBuckets, onCreateBucket }) => {
  const notify = useNotify()
  const refresh = useRefresh()
  const { selectedBucket, setSelectedBucket, currentPath } = useAssetProvider()
  const [folderPath, setFolderPath] = React.useState('')

  const handleSubmit = async () => {
    if (!selectedBucket) {
      notify('Please select a bucket', { type: 'warning' })
      return
    }
    if (!folderPath.trim()) {
      notify('Please enter a folder name or path', { type: 'warning' })
      return
    }

    const fullPath = currentPath ? `${currentPath.replace(/^\/+/, '')}/${folderPath.replace(/^\/+|\/+$/g, '')}` : folderPath
    console.log('fullPath', fullPath)
    try {
      const res = await fetch(`${config.VITE_ASSET_API_URL}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ bucketName: selectedBucket, folderPath: fullPath }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create folder')
      }
      notify('Folder created successfully', { type: 'success' })
      onClose()
      setFolderPath('')
      clearResourceCache('asset')
      refresh()
      onRefreshBuckets()
    } catch (e: any) {
      notify(e?.message || 'Failed to create folder', { type: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        New Folder{selectedBucket && ` in "${selectedBucket}${currentPath ? `/${currentPath}` : ''}"`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {!selectedBucket && (
            <Box sx={{ mb: 3 }}>
              <BucketSelector
                selectedBucket={selectedBucket}
                onBucketChange={setSelectedBucket}
                buckets={buckets.map(b => b.name)}
                onRefreshBuckets={onRefreshBuckets}
                onCreateBucket={async (name: string) => {
                  await onCreateBucket(name);
                }}
              />
            </Box>
          )}
          <TextField
            fullWidth
            autoFocus
            label="Folder name or path"
            placeholder="e.g. images/2025/banners"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            helperText="Use / to create nested folders"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>Create Folder</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

