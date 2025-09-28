import AddIcon from '@mui/icons-material/Add';
import DomainIcon from '@mui/icons-material/Domain';
import HttpIcon from '@mui/icons-material/Http';
import LanguageIcon from '@mui/icons-material/Language';
import ServerIcon from '@mui/icons-material/Storage';
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import {
  AutocompleteInput,
  ReferenceInput,
  required,
  TextInput
} from 'react-admin';
import { CreateHostingProviderModal, CreateServerModal } from '../../../../_components';

interface DomainBasicInfoProps {
  prefix?: string;
}

const DomainBasicInfo: React.FC<DomainBasicInfoProps> = ({ prefix = '' }) => {
  const [hostingProviderModalOpen, setHostingProviderModalOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DomainIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">Domain Name</Typography>
            </Box>
            <TextInput 
              source={`${prefix}domain`} 
              label="Domain" 
              fullWidth 
              helperText="e.g., example.com (without www or http)" 
              variant="outlined"
              validate={required()}
            />
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HttpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">Website URL</Typography>
            </Box>
            <TextInput 
              source={`${prefix}url`} 
              label="URL" 
              fullWidth 
              helperText="e.g., https://www.example.com" 
              variant="outlined"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">Technology</Typography>
            </Box>
            <TextInput 
              source={`${prefix}technology`} 
              label="Technology" 
              fullWidth 
              helperText="e.g., WordPress, Shopify, etc." 
              variant="outlined"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ServerIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1">Hosting Provider</Typography>
              </Box>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setHostingProviderModalOpen(true)}
                variant="outlined"
              >
                Add New
              </Button>
            </Box>
            <ReferenceInput 
              source={`${prefix}hostingProviderId`} 
              reference="hosting-provider"
            >
              <AutocompleteInput
                optionText="name"
                fullWidth
                variant="outlined"
                label="Hosting Provider"
                helperText="Select the hosting provider"
                validate={required()}
              />
            </ReferenceInput>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ServerIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1">Server</Typography>
              </Box>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setServerModalOpen(true)}
                variant="outlined"
              >
                Add New
              </Button>
            </Box>
            <ReferenceInput 
              source={`${prefix}serverId`} 
              reference="server"
            >
              <AutocompleteInput
                optionText="hostname"
                fullWidth
                label="Server"
                variant="outlined"
                helperText="Select the server"
              />
            </ReferenceInput>
          </Box>
        </Grid>
      </Grid>
      
      <CreateHostingProviderModal 
        isModalOpen={hostingProviderModalOpen} 
        setIsModalOpen={setHostingProviderModalOpen}
      />
      
      <CreateServerModal 
        isModalOpen={serverModalOpen} 
        setIsModalOpen={setServerModalOpen}
      />
    </>
  );
};

export default DomainBasicInfo; 