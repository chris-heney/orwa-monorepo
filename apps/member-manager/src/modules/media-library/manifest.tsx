import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { ActionManifest, ModuleManifest } from '../../framework/manifest';
import { usePageValue } from '../../framework/PageLocalState';
import HeadingAction from '../_components/heading/HeadingAction';
import MediaLibraryPage from './MediaLibraryPage';

/* ---------- bar components (read the page's published state) ---------- */

const FileCount = () => {
  const [loading] = usePageValue('media.loading', true);
  const [total] = usePageValue('media.total', 0);
  const [inLibrary] = usePageValue<number | null>('media.inLibrary', null);
  return (
    <Box sx={{ textAlign: 'right' }}>
      <Typography
        variant="body2"
        sx={{
          color: 'inherit',
          fontWeight: 700,
          fontSize: { xs: '0.7rem', sm: '0.8125rem' },
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          opacity: loading ? 0.75 : 1,
        }}
      >
        {loading
          ? '…'
          : `${total.toLocaleString()} ${total === 1 ? 'file' : 'files'}`}
      </Typography>
      {inLibrary != null ? (
        <Typography
          variant="caption"
          sx={{ color: 'grey.400', display: 'block', lineHeight: 1.2 }}
        >
          {inLibrary.toLocaleString()} in library
        </Typography>
      ) : null}
    </Box>
  );
};

const UploadAction = () => {
  const [upload] = usePageValue<(() => void) | undefined>(
    'media.upload',
    undefined
  );
  const [uploading] = usePageValue('media.uploading', false);
  return (
    <HeadingAction
      icon={
        uploading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <CloudUploadIcon fontSize="small" />
        )
      }
      label="Upload"
      disabled={uploading || !upload}
      onClick={() => upload?.()}
    />
  );
};

const RefreshLibraryAction = () => {
  const [refresh] = usePageValue<(() => void) | undefined>(
    'media.refresh',
    undefined
  );
  const [loading] = usePageValue('media.loading', true);
  return (
    <HeadingAction
      icon={<RefreshIcon fontSize="small" />}
      label="Refresh library"
      disabled={loading || !refresh}
      onClick={() => refresh?.()}
    />
  );
};

const fileCountAction: ActionManifest = {
  id: 'file-count',
  label: 'Files',
  icon: PermMediaIcon,
  scope: 'list',
  order: 10,
  component: FileCount,
};
const uploadAction: ActionManifest = {
  id: 'upload',
  label: 'Upload',
  icon: CloudUploadIcon,
  scope: 'list',
  component: UploadAction,
};
const refreshLibraryAction: ActionManifest = {
  id: 'refresh-library',
  label: 'Refresh library',
  icon: RefreshIcon,
  scope: 'list',
  component: RefreshLibraryAction,
};

/* ---------- manifest ---------- */

export const mediaLibraryModule: ModuleManifest = {
  id: 'media-library',
  title: 'Media Library',
  icon: PermMediaIcon,
  menu: { label: 'Media Library', to: '/media-library' },
  permissions: {
    pathPrefixes: ['/media-library', '/upload/files'],
    resources: ['upload/files', 'upload'],
  },
  resources: {
    'upload/files': { recordRepresentation: 'url' },
    upload: {},
  },
  pages: [
    {
      id: 'media-library.page',
      route: 'media-library',
      kind: 'custom',
      titleBar: {
        title: 'Media Library',
        infoTooltip:
          'Upload, search, and filter files in your browser. Copy or download public URLs for emails and the site. In list view, use column headers to sort.',
      },
      actions: [fileCountAction, uploadAction, refreshLibraryAction],
      body: MediaLibraryPage,
    },
  ],
};

export default mediaLibraryModule;
