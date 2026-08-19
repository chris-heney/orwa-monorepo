import { useForm, FormProvider } from 'react-hook-form';
import { useEffect } from 'react';
import { useFormAutoSave } from './hooks/useFormAutoSave';

interface FormProps {
    children: React.ReactNode;
    defaultValues?: Record<string, any>;
    autoSave?: boolean;
}

const FormContent = ({ children, autoSave = true }: { children: React.ReactNode; autoSave?: boolean }) => {
  useFormAutoSave({ enabled: autoSave });
  
  return (
    <form>
      {children}
    </form>
  );
};

const Form = ({ children, defaultValues, autoSave = true }: FormProps) => {
  
  const methods = useForm({ defaultValues });

  // Reset form when defaultValues change (for restoring saved data)
  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <FormContent autoSave={autoSave}>
        {children}
      </FormContent>
    </FormProvider>
  );
};


export { Form };