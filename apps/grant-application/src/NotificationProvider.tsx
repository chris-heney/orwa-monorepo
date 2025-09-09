import { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface INotifyContext {
  notify: (message: string, type?: NotificationType) => void;
}

const defaultNotify: INotifyContext = {
  notify: (message: string, type: NotificationType = 'info') => {
    console.log(message, type);
  }
};

const NotifyContext = createContext<INotifyContext>(defaultNotify);

export const useNotify = () => {
  return useContext(NotifyContext);
};

export const NotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType; open: boolean }>({
    message: '',
    type: 'info',
    open: false,
  });

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, open: true });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 2500);
  };

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      default:
        return null;
    }
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          icon={getIcon(notification.type)}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
};