import React from 'react'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useAssetProvider } from '../context/AssetProvider'

export const PathBreadcrumbs: React.FC = () => {
  const { selectedBucket, currentPath, setCurrentPath, pathSegments } = useAssetProvider()

  const onClickRoot = () => setCurrentPath('')

  const onClickCrumb = (idx: number) => {
    const newPath = pathSegments.slice(0, idx + 1).join('/')
    setCurrentPath(newPath)
  }

  return (
    <Breadcrumbs aria-label="path" sx={{ mb: 1 }}>
      <Link
        component="button"
        onClick={onClickRoot}
        underline="hover"
      >
        {selectedBucket || 'All Buckets'}
      </Link>
      {pathSegments.map((seg, idx) =>
        idx === pathSegments.length - 1 ? (
          <Typography key={idx} color="text.primary">{seg}</Typography>
        ) : (
          <Link key={idx} component="button" underline="hover" onClick={() => onClickCrumb(idx)}>
            {seg}
          </Link>
        )
      )}
    </Breadcrumbs>
  )
}

