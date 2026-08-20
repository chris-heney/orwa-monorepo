import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useGetOne } from 'react-admin';
import DynamicRecipientList from './DynamicRecipientList';
import { Alert } from '@mui/material';

interface FormConnectedRecipientListProps {
  maxHeight?: number;
}

const FormConnectedRecipientList: React.FC<FormConnectedRecipientListProps> = ({
  maxHeight = 400,
}) => {
  const { watch } = useFormContext();

  const entityValue = watch('entity') || '';
  const conditionValue = watch('condition');
  const savedQueryValue = watch('saved_query');
  const emailTemplateValue = watch('email_template');
  const taskNameValue = watch('name');
  const taskIdValue = watch('id');

  const savedQueryId =
    typeof savedQueryValue === 'object' && savedQueryValue !== null
      ? savedQueryValue.id
      : savedQueryValue;

  // The task selects recipients through the linked query, so the preview has
  // to read the query's live filters — not the task's own condition, which is
  // only a fallback for tasks predating the link.
  const { data: savedQuery } = useGetOne(
    'saved-queries',
    { id: savedQueryId },
    { enabled: !!savedQueryId }
  );

  const effectiveCondition = savedQueryId
    ? savedQuery?.filters ?? {}
    : conditionValue || {};

  if (entityValue === '') {
    return (
      <Alert severity="info">Select an entity to preview recipients</Alert>
    );
  }

  if (savedQueryId && !savedQuery) {
    return <Alert severity="info">Loading the selected query…</Alert>;
  }

  return (
    <DynamicRecipientList
      key={`${entityValue}-${JSON.stringify(effectiveCondition)}`} // Force re-render when entity or condition changes
      maxHeight={maxHeight}
      entity={entityValue + 's'}
      condition={effectiveCondition}
      emailTemplate={emailTemplateValue}
      taskId={taskIdValue}
      taskName={taskNameValue}
    />
  );
};

export default FormConnectedRecipientList;
