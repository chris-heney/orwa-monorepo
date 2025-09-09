import { useForm, FormProvider } from 'react-hook-form';
import { useEffect } from 'react';
import { testPayload } from './data/payload-examples';
import { useFormAutoSave } from './hooks/useFormAutoSave';

interface FormProps {
    children: React.ReactNode;
    defaultValues?: Record<string, any>;
    test?: boolean;
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

const Form = ({ children, defaultValues, test = false, autoSave = true }: FormProps) => {
  
  const methods = useForm({ defaultValues: test ? testPayload : defaultValues});

  // Reset form when defaultValues change (for restoring saved data)
  useEffect(() => {
    if (defaultValues && !test) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, test, methods]);

  return (
    <FormProvider {...methods}>
      <FormContent autoSave={autoSave}>
        {children}
      </FormContent>
    </FormProvider>
  );
};


export { Form };