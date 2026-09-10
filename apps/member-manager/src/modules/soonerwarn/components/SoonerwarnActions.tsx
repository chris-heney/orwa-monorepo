import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import type { ActionManifest } from '../../../framework/manifest';
import { AddAction } from '../../_components/heading/HeadingActions';
import { useSoonerwarnContext } from '../SoonerwarnContextProvider';
import SoonerwarnEmailSideBar from '../../emails-magement/SoonerwarnEmailSidebar';

/** Bar action: toggles the inline "new application" form in the list panel. */
const AddNewToggle = () => {
  const { isCreating, setIsCreating } = useSoonerwarnContext();
  return (
    <AddAction
      label="Add New"
      active={isCreating}
      data-testid="heading-action-add-new"
      onClick={() => setIsCreating((prev) => !prev)}
    />
  );
};

export const addNewAction: ActionManifest = {
  id: 'add-new',
  label: 'Add New',
  icon: AddIcon,
  scope: 'list',
  component: AddNewToggle,
  order: 60,
};

/** Notifications drawer body (email templates of the SoonerWARN module). */
export const SoonerwarnNotificationsBody = () => (
  <SoonerwarnEmailSideBar module="Soonerwarn Managment" />
);
