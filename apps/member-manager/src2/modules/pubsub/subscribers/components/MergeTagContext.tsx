import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MergeTagContextType {
  activeField: string | null;
  setActiveField: (field: string | null) => void;
  insertTag: (tag: string) => void;
  pendingTag: string | null;
  setPendingTag: (tag: string | null) => void;
}

const MergeTagContext = createContext<MergeTagContextType | undefined>(undefined);

interface MergeTagProviderProps {
  children: ReactNode;
}

export const MergeTagProvider: React.FC<MergeTagProviderProps> = ({ children }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [pendingTag, setPendingTag] = useState<string | null>(null);

  // Listen for setActiveField events from TinyMCE and other components
  useEffect(() => {
    const handleSetActiveField = (event: CustomEvent) => {
      const { field } = event.detail;
      setActiveField(field);
    };

    window.addEventListener('setActiveField', handleSetActiveField as EventListener);
    return () => {
      window.removeEventListener('setActiveField', handleSetActiveField as EventListener);
    };
  }, []);

  const insertTag = (tag: string) => {
    if (activeField) {
      // Store the tag to be inserted
      setPendingTag(tag);
      
      // Trigger a custom event that form fields can listen to
      const event = new CustomEvent('insertMergeTag', {
        detail: { field: activeField, tag }
      });
      window.dispatchEvent(event);
    }
  };

  const value: MergeTagContextType = {
    activeField,
    setActiveField,
    insertTag,
    pendingTag,
    setPendingTag,
  };

  return (
    <MergeTagContext.Provider value={value}>
      {children}
    </MergeTagContext.Provider>
  );
};

export const useMergeTag = (): MergeTagContextType => {
  const context = useContext(MergeTagContext);
  if (!context) {
    throw new Error('useMergeTag must be used within a MergeTagProvider');
  }
  return context;
};
