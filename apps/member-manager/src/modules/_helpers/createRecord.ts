import React from 'react';
import { FieldValues } from 'react-hook-form';
import { UseCreate, UseNotifyFunction } from '../conference/types/helpers';
import { formatTitle } from '../../helpers/formatResourceTitle';

export const createRecord = (
  data: FieldValues,
  create: UseCreate,
  notify: UseNotifyFunction,
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>,
  resource: string,
  onCreated?: () => void
) => {
  const title = resource
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
    .replace(/(?:s)$/, '');
  const recordData = {
    ...data,
  };
  // Notify from the mutation callbacks — create() does not throw on API
  // errors, so the old try/catch always reported success (even on 403).
  create(
    `${resource}`,
    { data: recordData },
    {
      onSuccess: () => {
        notify(`${formatTitle(resource)} was Created`, { type: 'success' });
        setIsCreating(false);
        onCreated?.();
      },
      onError: (error: unknown) => {
        console.error(`Error creating ${resource}:`, error);
        notify(`Error creating ${title}`, { type: 'error' });
      },
    }
  );
};
