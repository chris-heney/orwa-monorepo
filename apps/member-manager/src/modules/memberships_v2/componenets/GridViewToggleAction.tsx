import React from 'react';
import { useStore } from 'react-admin';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import HeadingAction from '../../_components/heading/HeadingAction';
import { ASSOCIATE_GRID_VIEW_KEY } from '../associate/gridViewKey';

/** Associates tab: switch the panel between the datagrid and the card grid. */
export const GridViewToggleAction = () => {
  const [isGridView, setIsGridView] = useStore<boolean>(
    ASSOCIATE_GRID_VIEW_KEY,
    false
  );
  return (
    <HeadingAction
      icon={
        isGridView ? (
          <ViewListIcon fontSize="small" />
        ) : (
          <GridViewIcon fontSize="small" />
        )
      }
      label={isGridView ? 'Switch to List View' : 'Switch to Grid View'}
      onClick={() => setIsGridView(!isGridView)}
    />
  );
};

export default GridViewToggleAction;
