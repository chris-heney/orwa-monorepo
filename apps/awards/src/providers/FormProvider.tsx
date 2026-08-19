import { useForm, FormProvider } from 'react-hook-form';
import { useEffect } from 'react';
import { testPayload } from '../data/testPayload';

interface FormProps {
    children: React.ReactNode;
    defaultValues?: Record<string, any>;
    test?: boolean;
}

const Form = ({ children, defaultValues, test = false }: FormProps) => {
  
  const methods = useForm({ defaultValues: test ? testPayload : defaultValues});

  // Reset form when defaultValues change (for restoring saved data)
  useEffect(() => {
    if (defaultValues && !test) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, test, methods]);

  return (
    <FormProvider {...methods}>
      <form>
        {children}
      </form>
    </FormProvider>
  );
};


export { Form };