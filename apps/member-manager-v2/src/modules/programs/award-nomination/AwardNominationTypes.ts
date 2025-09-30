import { IContact } from '../../training/_types';

export interface IAwardNomination {
  id?: number;
  // Contact Information
  contact?: IContact;
  
  // Nominee/System Information
  nominee_name: string;
  system_name: string;
  watersystem?: {
    id: number;
    name: string;
  };
  county: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Contact Information
  daytime_phone: string;
  email: string;
  
  // General Information
  operation_start_date?: string;
  employment_date?: string;
  current_members?: number;
  beginning_members?: number;
  
  // Employee Information
  clerical_employees?: number;
  operation_maintenance_employees?: number;
  management_employees?: number;
  
  // Nomination Details
  nomination_description: string;
  award_type: 
    | "Water/Wastewater System of the Year"
    | "Excellence in Operations"
    | "Excellence in Management"
    | "Excellence in Office Operations";
  
  // Files
  supporting_documents?: StrapiFile[];
  nomination_pdf?: StrapiFile;
  
  // Metadata
  award_year: number;
  nomination_status: 'Draft' | 'Submitted' | 'Under Review' | 'Winner' | 'Runner Up' | 'Not Selected';
  submission_date?: string;
  review_notes?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiFile {
  id: number;
  name: string;
  url: string;
  size?: number;
  mime?: string;
}

export interface IAwardFormPayload extends Partial<IAwardNomination> {
  // Form submission payload type
}
