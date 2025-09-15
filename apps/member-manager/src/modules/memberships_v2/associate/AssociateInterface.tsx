import { Identifier } from 'react-admin'
import { IContact } from '../../training/_types';

export interface IAssociate {
    membership: Identifier
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
    logo?: File
    phone: string;
    total_years: number;
    email: string;
    contact_primary: IContact
    contact_secondary:  IContact
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
    annual_report_type: "Digital" | "Mail" | "Both" | "None";
    membership_directory_type: "Digital" | "Mail" | "Both" | "None";
    payment_last_date: string;
    payment_method: "Card" | "eCheck" | "Invoice";
    payment_amount: number;
    fee_membership: number;
    fee_scholarship: number;
    payment_details: string;
    wp_uid?: number;
    wp_eid?: number;
    application_date: string;
    directory_mailed?: boolean;
    primary_ad?: {
        url: string
    };
    payment_previous_date: string;
    directory_sent_date?: string;
  }
  