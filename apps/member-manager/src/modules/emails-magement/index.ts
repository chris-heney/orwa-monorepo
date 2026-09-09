// Module manifest (framework)
export { emailsModule } from './manifest';

// Email components
export { EmailInterface } from './emails-templates/EmailInterface';
export { default as EmailFormFields } from './emails-templates/EmailFormFields';
export { default as CreateEmail } from './emails-templates/CreateEmail';
export { default as EditEmail } from './emails-templates/EditEmail';

// Email Task components
export { default as ScheduledEmailTaskInterface } from './email-taks/ScheduledTaskList';
export { default as EmailTaskFormFields } from './email-taks/EmailTaskFormFields';
export { default as CreateEmailTask } from './email-taks/CreateEmailTask';
export { default as EditEmailTask } from './email-taks/EditEmailTask';

// Email Log components
export { EmailLogsList } from './email-logs/EmailLogList';
export { default as EmailLogFilters } from './email-logs/EmailLogFilters';

// Helper components
export { default as EmailSideBar } from './EmailSidebar';
export { default as SoonerwarnEmailSideBar } from './SoonerwarnEmailSidebar';
 