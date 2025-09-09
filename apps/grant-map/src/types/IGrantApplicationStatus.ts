export default interface IGrantApplicationStatus {
  id: string;
  data: {
    type: string;
    name: string;
    description: string;
    color: string;
    order: number;
    next_statuses: IGrantApplicationStatus[] | null;
    grant_sub_statuses: IGrantApplicationStatus[] | null;
    email_templates?: unknown;
  };
}

export interface IStatus {
  id: number;
  name: string;
  description: string;
  color: string;
}
