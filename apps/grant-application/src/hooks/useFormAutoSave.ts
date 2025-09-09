import { useEffect, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { saveFormData } from '../helpers/formPersistence';
import { FormSteps } from '../providers/AppContextProvider';
import { useUserContext } from '../providers/UserContextProvider';

interface UseFormAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
}

export const useFormAutoSave = ({ 
  enabled = true, 
}: UseFormAutoSaveOptions = {}) => {
  const { getValues } = useFormContext();
  const { stepIndex } = useContext(FormSteps);
  const { isAdminView } = useUserContext();

  useEffect(() => {
    if (!enabled || isAdminView) return;

    // if watersystem name is empty, don't save meaning they havent yet clicked continue
    if (getValues('legal_entity_name') === '') return;

    // Create an interval to save form data periodically
      try {
        const currentFormData = getValues();
        // Only save if there's actual data (not empty object)
        if (currentFormData && Object.keys(currentFormData).length > 0) {
          // Check if there are any meaningful values (not just empty strings)
          const hasData = Object.values(currentFormData).some(value => {
            if (typeof value === 'string') return value.trim().length > 0;
            if (typeof value === 'number') return value !== 0;
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
            return Boolean(value);
          });
          
          if (hasData) {
            saveFormData(currentFormData, stepIndex);
            console.log('Saving form data', currentFormData);
          }
        }
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }

  }, [stepIndex]);

}; 