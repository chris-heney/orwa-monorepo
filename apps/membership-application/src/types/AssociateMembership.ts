import { IContactPayload, Identifier, Membership, PaymentInformation, StoredStrapiFile, StrapiFormattedFile } from ".";

export interface Associate {
  // Strapi v5: populated relation is a flat object (or null when unset)
  membership: Membership | null;
  id: Identifier;
  name: string;
  category?:
    | "Accountant"
    | "Attorneys Bond Counsel"
    | "Automated Controls"
    | "Automatic Flushing"
    | "Automatic Meter Reading"
    | "Automotive Dealer"
    | "CNG"
    | "Car Dealership"
    | "Commercial"
    | "Communications"
    | "Community Service"
    | "Computers and Software"
    | "Construction"
    | "Consulting Service"
    | "Control Valve Sales and Service"
    | "Damage Prevention"
    | "Distributor"
    | "Electric Motor and Pump Repair"
    | "Electronic Fusion"
    | "Engineer"
    | "Environmental Service"
    | "Equipment Service Rental and Sales"
    | "Financial Service"
    | "Flow Meters"
    | "GIS"
    | "GPS Mapping and Survey Equipment"
    | "Geophysical Water Well Logging"
    | "Government Accounting Software"
    | "Health Care"
    | "Insurance"
    | "Lagoon Cleanouts"
    | "Landscape and Lawn Care"
    | "Manufacturer"
    | "Manufactures Rep"
    | "Mechanical/Plumbing and Maintenance"
    | "Meter and Automation"
    | "Meters and Meter Reading Equipment"
    | "Motor Carriers"
    | "Motor and Pump Repair"
    | "Municipal Services"
    | "Non-Destructive Testing"
    | "Oil Field Construction"
    | "Oilfield Flowback Services"
    | "Oilfield Service Company"
    | "Other"
    | "Painting and Coatings"
    | "Pumps"
    | "Rail Car Maintenance and Repair"
    | "Ranching"
    | "Residential and Industrial"
    | "Roofing"
    | "SCADA/Telemetry"
    | "Sales Representative"
    | "Sales Representatives"
    | "Sanitary Sewer Evaluation Services"
    | "Software and Supplies"
    | "Storage Tanks"
    | "Suppliers"
    | "Tank Inspection"
    | "Tank Maintenance"
    | "Training"
    | "Truck Equipment"
    | "Valves"
    | "Vehicles"
    | "Water Analysis"
    | "Water Metering"
    | "Water Meters"
    | "Water Operator Training"
    | "Water Tanks"
    | "Water Treatment"
    | "Water Well Drilling and Pump Installation"
    | "Website Provider"
    | "Welding/Fabrication";
  member_level?: "None" | "Basic" | "Bronze" | "Silver" | "Gold" | "Platinum";
  website?: string;
  logo?: StoredStrapiFile[] | null;
  phone: string;
  total_years: number;
  email: string;
  contact_primary: (IContactPayload & { id: Identifier; documentId?: string }) | null;
  contact_secondary: (IContactPayload & { id: Identifier; documentId?: string }) | null;
  mailing_address_street: string;
  mailing_address_city: string;
  mailing_address_state: string;
  mailing_address_zip: string;
  address_street: string;
  address_city: string;
  address_state:
    | "Alabama"
    | "Alaska"
    | "Arizona"
    | "Arkansas"
    | "California"
    | "Colorado"
    | "Connecticut"
    | "Delaware"
    | "Florida"
    | "Georgia"
    | "Hawaii"
    | "Idaho"
    | "Illinois"
    | "Indiana"
    | "Iowa"
    | "Kansas"
    | "Kentucky"
    | "Louisiana"
    | "Maine"
    | "Maryland"
    | "Massachusetts"
    | "Michigan"
    | "Minnesota"
    | "Mississippi"
    | "Missouri"
    | "Montana"
    | "Nebraska"
    | "Nevada"
    | "New Hampshire"
    | "New Jersey"
    | "New Mexico"
    | "New York"
    | "North Carolina"
    | "North Dakota"
    | "Ohio"
    | "Oklahoma"
    | "Oregon"
    | "Pennsylvania"
    | "Rhode Island"
    | "South Carolina"
    | "South Dakota"
    | "Tennessee"
    | "Texas"
    | "Utah"
    | "Vermont"
    | "Virginia"
    | "Washington"
    | "West Virginia"
    | "Wisconsin"
    | "Wyoming";
  address_zip?: string;
  membership_directory_type: "Digital" | "Mail" | "Both" | "None";
  payment_last_date?: string;
  payment_method?: "Card" | "eCheck" | "Invoice";
  payment_amount: number;
  fee_membership: number;
  fee_scholarship: number;
  payment_details?: string;
  wp_uid?: number;
  wp_eid?: number;
  application_date?: string;
  directory_mailed?: boolean;
  primary_ad?: StoredStrapiFile | null;
  payment_previous_date?: string;
  directory_sent_date?: string;
}

export interface AssociateMembershipPayload {
  associate: string;
  name: string;
  category?:
    | "Accountant"
    | "Attorneys Bond Counsel"
    | "Automated Controls"
    | "Automatic Flushing"
    | "Automatic Meter Reading"
    | "Automotive Dealer"
    | "CNG"
    | "Car Dealership"
    | "Commercial"
    | "Communications"
    | "Community Service"
    | "Computers and Software"
    | "Construction"
    | "Consulting Service"
    | "Control Valve Sales and Service"
    | "Damage Prevention"
    | "Distributor"
    | "Electric Motor and Pump Repair"
    | "Electronic Fusion"
    | "Engineer"
    | "Environmental Service"
    | "Equipment Service Rental and Sales"
    | "Financial Service"
    | "Flow Meters"
    | "GIS"
    | "GPS Mapping and Survey Equipment"
    | "Geophysical Water Well Logging"
    | "Government Accounting Software"
    | "Health Care"
    | "Insurance"
    | "Lagoon Cleanouts"
    | "Landscape and Lawn Care"
    | "Manufacturer"
    | "Manufactures Rep"
    | "Mechanical/Plumbing and Maintenance"
    | "Meter and Automation"
    | "Meters and Meter Reading Equipment"
    | "Motor Carriers"
    | "Motor and Pump Repair"
    | "Municipal Services"
    | "Non-Destructive Testing"
    | "Oil Field Construction"
    | "Oilfield Flowback Services"
    | "Oilfield Service Company"
    | "Other"
    | "Painting and Coatings"
    | "Pumps"
    | "Rail Car Maintenance and Repair"
    | "Ranching"
    | "Residential and Industrial"
    | "Roofing"
    | "SCADA/Telemetry"
    | "Sales Representative"
    | "Sales Representatives"
    | "Sanitary Sewer Evaluation Services"
    | "Software and Supplies"
    | "Storage Tanks"
    | "Suppliers"
    | "Tank Inspection"
    | "Tank Maintenance"
    | "Training"
    | "Truck Equipment"
    | "Valves"
    | "Vehicles"
    | "Water Analysis"
    | "Water Metering"
    | "Water Meters"
    | "Water Operator Training"
    | "Water Tanks"
    | "Water Treatment"
    | "Water Well Drilling and Pump Installation"
    | "Website Provider"
    | "Welding/Fabrication";
  member_level?: "None" | "Basic" | "Bronze" | "Silver" | "Gold" | "Platinum";
  website?: string;
  logo: StrapiFormattedFile[];
  phone?: string;
  total_years?: number;
  email: string;
  contact_primary: IContactPayload;
  contact_secondary: IContactPayload;
  mailing_address_street: string;
  mailing_address_city: string;
  mailing_address_state:
    | ""
    | "Alabama"
    | "Alaska"
    | "Arizona"
    | "Arkansas"
    | "California"
    | "Colorado"
    | "Connecticut"
    | "Delaware"
    | "Florida"
    | "Georgia"
    | "Hawaii"
    | "Idaho"
    | "Illinois"
    | "Indiana"
    | "Iowa"
    | "Kansas"
    | "Kentucky"
    | "Louisiana"
    | "Maine"
    | "Maryland"
    | "Massachusetts"
    | "Michigan"
    | "Minnesota"
    | "Mississippi"
    | "Missouri"
    | "Montana"
    | "Nebraska"
    | "Nevada"
    | "New Hampshire"
    | "New Jersey"
    | "New Mexico"
    | "New York"
    | "North Carolina"
    | "North Dakota"
    | "Ohio"
    | "Oklahoma"
    | "Oregon"
    | "Pennsylvania"
    | "Rhode Island"
    | "South Carolina"
    | "South Dakota"
    | "Tennessee"
    | "Texas"
    | "Utah"
    | "Vermont"
    | "Virginia"
    | "Washington"
    | "West Virginia"
    | "Wisconsin"
    | "Wyoming"
    | null
  mailing_address_zip?: string;
  address_street?: string;
  address_city?: string;
  address_state?:
    | "Alabama"
    | "Alaska"
    | "Arizona"
    | "Arkansas"
    | "California"
    | "Colorado"
    | "Connecticut"
    | "Delaware"
    | "Florida"
    | "Georgia"
    | "Hawaii"
    | "Idaho"
    | "Illinois"
    | "Indiana"
    | "Iowa"
    | "Kansas"
    | "Kentucky"
    | "Louisiana"
    | "Maine"
    | "Maryland"
    | "Massachusetts"
    | "Michigan"
    | "Minnesota"
    | "Mississippi"
    | "Missouri"
    | "Montana"
    | "Nebraska"
    | "Nevada"
    | "New Hampshire"
    | "New Jersey"
    | "New Mexico"
    | "New York"
    | "North Carolina"
    | "North Dakota"
    | "Ohio"
    | "Oklahoma"
    | "Oregon"
    | "Pennsylvania"
    | "Rhode Island"
    | "South Carolina"
    | "South Dakota"
    | "Tennessee"
    | "Texas"
    | "Utah"
    | "Vermont"
    | "Virginia"
    | "Washington"
    | "West Virginia"
    | "Wisconsin"
    | "Wyoming";
  address_zip?: string;
  membership_directory_type: "Digital" | "Mail" | "Both" | "None";
  payment_last_date?: string;
  payment_method?: "Card" | "eCheck" | "Invoice";
  payment_amount?: number;
  fee_membership?: number;
  fee_scholarship?: number;
  payment_details?: string;
  // wp_uid?: number;
  // wp_eid?: number;
  application_date?: string;
  directory_mailed?: boolean;
  primary_ad?: StrapiFormattedFile;
  payment_previous_date?: string;
  directory_sent_date?: string;
  membership: number;
  address_billing_line1: string;
  address_billing_city: string;
  address_billing_state: string;
  address_billing_zip: string;
  billing_email: string;
  billing_phone: string;
  billing_first_name: string;
  billing_last_name: string;
  payment_information?: PaymentInformation;
}

export interface EmptyAssociateMembershipPayload {
  associate: string;
  name: string;
  category: string;
  logo: StrapiFormattedFile[];
  phone: string;
  total_years: number;
  email: string;
  contact_primary: IContactPayload;
  contact_secondary: IContactPayload;
  mailing_address_street?: string | null;
  mailing_address_city?: string | null;
  mailing_address_state?: string  | null;
  mailing_address_zip?: string | null;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip?: string;
  membership_directory_type: string;
  payment_last_date?: string;
  payment_method: string;
  payment_amount: number;
  fee_membership: number;
  fee_scholarship: number;
  payment_details: string;
  application_date?: string;
  primary_ad?: StrapiFormattedFile;
  payment_previous_date?: string;
  membership: number;
  address_billing_line1: string;
  address_billing_city: string;
  address_billing_state: string;
  address_billing_zip: string;
  billing_email: string;
  billing_phone: string;
  billing_first_name: string;
  billing_last_name: string;
  payment_information?: PaymentInformation;
}

export const assoociateCategoryOptions = [
  { value: "Accountant", label: "Accountant" },
  { value: "Attorneys Bond Counsel", label: "Attorneys Bond Counsel" },
  { value: "Automated Controls", label: "Automated Controls" },
  { value: "Automatic Flushing", label: "Automatic Flushing" },
  { value: "Automatic Meter Reading", label: "Automatic Meter Reading" },
  { value: "Automotive Dealer", label: "Automotive Dealer" },
  { value: "CNG", label: "CNG" },
  { value: "Car Dealership", label: "Car Dealership" },
  { value: "Commercial", label: "Commercial" },
  { value: "Communications", label: "Communications" },
  { value: "Community Service", label: "Community Service" },
  { value: "Computers and Software", label: "Computers and Software" },
  { value: "Construction", label: "Construction" },
  { value: "Consulting Service", label: "Consulting Service" },
  {
    value: "Control Valve Sales and Service",
    label: "Control Valve Sales and Service",
  },
  { value: "Damage Prevention", label: "Damage Prevention" },
  { value: "Distributor", label: "Distributor" },
  {
    value: "Electric Motor and Pump Repair",
    label: "Electric Motor and Pump Repair",
  },
  { value: "Electronic Fusion", label: "Electronic Fusion" },
  { value: "Engineer", label: "Engineer" },
  { value: "Environmental Service", label: "Environmental Service" },
  {
    value: "Equipment Service Rental and Sales",
    label: "Equipment Service Rental and Sales",
  },
  { value: "Financial Service", label: "Financial Service" },
  { value: "Flow Meters", label: "Flow Meters" },
  { value: "GIS", label: "GIS" },
  {
    value: "GPS Mapping and Survey Equipment",
    label: "GPS Mapping and Survey Equipment",
  },
  {
    value: "Geophysical Water Well Logging",
    label: "Geophysical Water Well Logging",
  },
  {
    value: "Government Accounting Software",
    label: "Government Accounting Software",
  },
  { value: "Health Care", label: "Health Care" },
  { value: "Insurance", label: "Insurance" },
  { value: "Lagoon Cleanouts", label: "Lagoon Cleanouts" },
  { value: "Landscape and Lawn Care", label: "Landscape and Lawn Care" },
  { value: "Manufacturer", label: "Manufacturer" },
  { value: "Manufactures Rep", label: "Manufactures Rep" },
  {
    value: "Mechanical/Plumbing and Maintenance",
    label: "Mechanical/Plumbing and Maintenance",
  },
  { value: "Meter and Automation", label: "Meter and Automation" },
  {
    value: "Meters and Meter Reading Equipment",
    label: "Meters and Meter Reading Equipment",
  },
  { value: "Motor Carriers", label: "Motor Carriers" },
  { value: "Motor and Pump Repair", label: "Motor and Pump Repair" },
  { value: "Municipal Services", label: "Municipal Services" },
  { value: "Non-Destructive Testing", label: "Non-Destructive Testing" },
  { value: "Oil Field Construction", label: "Oil Field Construction" },
  { value: "Oilfield Flowback Services", label: "Oilfield Flowback Services" },
  { value: "Oilfield Service Company", label: "Oilfield Service Company" },
  { value: "Other", label: "Other" },
  { value: "Painting and Coatings", label: "Painting and Coatings" },
  { value: "Pumps", label: "Pumps" },
  { value: "Print and Mail Services", label: "Print and Mail Services" },
  {
    value: "Rail Car Maintenance and Repair",
    label: "Rail Car Maintenance and Repair",
  },
  { value: "Ranching", label: "Ranching" },
  { value: "Residential and Industrial", label: "Residential and Industrial" },
  { value: "Roofing", label: "Roofing" },
  { value: "SCADA/Telemetry", label: "SCADA/Telemetry" },
  { value: "Sales Representative", label: "Sales Representative" },
  { value: "Sales Representatives", label: "Sales Representatives" },
  {
    value: "Sanitary Sewer Evaluation Services",
    label: "Sanitary Sewer Evaluation Services",
  },
  { value: "Software and Supplies", label: "Software and Supplies" },
  { value: "Storage Tanks", label: "Storage Tanks" },
  { value: "Suppliers", label: "Suppliers" },
  { value: "Tank Inspection", label: "Tank Inspection" },
  { value: "Tank Maintenance", label: "Tank Maintenance" },
  { value: "Training", label: "Training" },
  { value: "Truck Equipment", label: "Truck Equipment" },
  { value: "Valves", label: "Valves" },
  { value: "Vehicles", label: "Vehicles" },
  { value: "Water Analysis", label: "Water Analysis" },
  { value: "Water Metering", label: "Water Metering" },
  { value: "Water Meters", label: "Water Meters" },
  { value: "Water Operator Training", label: "Water Operator Training" },
  { value: "Water Tanks", label: "Water Tanks" },
  { value: "Water Treatment", label: "Water Treatment" },
  {
    value: "Water Well Drilling and Pump Installation",
    label: "Water Well Drilling and Pump Installation",
  },
  { value: "Website Provider", label: "Website Provider" },
  { value: "Welding/Fabrication", label: "Welding/Fabrication" },
];
