import React from 'react'
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { BucketSelector } from './BucketSelector'
import { FileUploader } from './FileUploader'
import { useAssetProvider } from '../context/AssetProvider'

interface Props {
  open: boolean
  onClose: () => void
  buckets: { name: string }[]
  refreshBuckets: () => void
  onCreateBucket: (name: string) => Promise<void>
  onUploadComplete: () => void
}

export const UploadDialog: React.FC<Props> = ({ open, onClose, buckets, refreshBuckets, onCreateBucket, onUploadComplete }) => {
  
  const { selectedBucket, setSelectedBucket, currentPath } = useAssetProvider()

  const displayPath = selectedBucket ? `${selectedBucket}${currentPath ? `/${currentPath}` : ''}` : ''
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Upload Files{selectedBucket && ` to "${displayPath}"`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {!selectedBucket && (
            <Box sx={{ mb: 3 }}>
              <BucketSelector
                selectedBucket={selectedBucket}
                onBucketChange={setSelectedBucket}
                buckets={buckets.map(b => b.name)}
                onRefreshBuckets={refreshBuckets}
                onCreateBucket={onCreateBucket}
              />
            </Box>
          )}
          <FileUploader onUploadComplete={onUploadComplete} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

