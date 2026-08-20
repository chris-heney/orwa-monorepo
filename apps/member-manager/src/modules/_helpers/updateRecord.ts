import { RaRecord } from 'react-admin';
import { FieldValues } from 'react-hook-form';
import {
  UseNotifyFunction,
  UseRemove,
  UseUpdate,
} from '../conference/types/helpers';

export const updateRecord = (
  data: FieldValues,
  record: RaRecord,
  update: UseUpdate,
  notify: UseNotifyFunction,
  remove: UseRemove,
  resource: string
) => {
  const recordData = {
    ...data,
  };
  // resource = conference-attendees => title = Conference Attendee
  // given the resource create a title for the notification reusable for all resources remove the pluralization
  const title = resource
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
    .replace(/(?:s)$/, '');

  update(
    `${resource}`,
    { id: record.id, data: recordData, previousData: record },
    {
      // Notify from the mutation callbacks, not the returned promise — the
      // promise resolves even when the API rejects (e.g. 403), which used to
      // show a success toast for a failed write.
      onSuccess: () => {
        notify(`${title} was Updated`, { type: 'success' });
        remove(`${resource}.datagrid.expanded`);
      },
      onError: (error: unknown) => {
        console.error(`Error updating ${resource}:`, error);
        notify(`Error updating ${title}`, { type: 'error' });
      },
    }
  );
};
