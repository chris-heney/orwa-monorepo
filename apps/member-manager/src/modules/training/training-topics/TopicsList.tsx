import React from 'react';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { ListView, TextField, SimpleList, NumberField } from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import { useEditRowClick } from '../../rbac-manager/useCan';

export const TRAINING_TOPICS_PREFERENCE_KEY = 'training-topics.datagrid';

/** Body of the `training.topics` page — renders inside the page's ListScope. */
const TopicsList = () => {
  const rowClick = useEditRowClick();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <ListView
      title=" "
      actions={false}
      sx={{
        '& .RaList-main': { marginTop: 0 },
        '& .RaList-content': { boxShadow: 'none' },
      }}
    >
      {isSmall ? (
        <SimpleList
          linkType="edit"
          primaryText={(record) => record.name}
          secondaryText={(record) => record.category}
          tertiaryText={(record) => record.hours}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={rowClick}>
          <TextField source="id" label="ID" noWrap />
          <TextField source="name" label="Name" noWrap />
          <TextField source="category" label="Category" noWrap />
          <NumberField source="hours" label="Hours" noWrap />
          <TextField source="description" label="Summary" noWrap />
        </DatagridConfigurable>
      )}
    </ListView>
  );
};

export default TopicsList;
