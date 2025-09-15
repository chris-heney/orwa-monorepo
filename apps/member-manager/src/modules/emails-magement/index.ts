// Main components
export { default as EmailManagement } from './EmailManagement';
export { default as EmailManagementDashboard } from './EmailManagementDashboard';
export { default as EmailManagementContextProvider } from './EmailManagementContextProvider';

// Email components
export { default as EmailInterface } from './emails-templates/EmailInterface';
export { default as EmailFormFields } from './emails-templates/EmailFormFields';
export { default as CreateEmail } from './emails-templates/CreateEmail';
export { default as EditEmail } from './emails-templates/EditEmail';

// Email Task components
export { default as ScheduledEmailTaskInterface } from './email-taks/ScheduledTaskList';
export { default as EmailTaskFormFields } from './email-taks/EmailTaskFormFields';
export { default as CreateEmailTask } from './email-taks/CreateEmailTask';
export { default as EditEmailTask } from './email-taks/EditEmailTask';

// Email Log components
export { default as EmailLogsList } from './email-logs/EmailLogList';
export { default as EmailLogFilters } from './email-logs/EmailLogFilters';

// Helper components
export { default as EmailSideBar } from './EmailSideBar';
export { default as SoonerwarnEmailSideBar } from './SoonerwarnEmailSidebar';

// Types
export * from './types'; 