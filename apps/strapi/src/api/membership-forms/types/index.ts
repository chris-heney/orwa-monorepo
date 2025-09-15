
export interface IContact {
  first: string;
  last: string;
  email: string;
  phone: string;
  title?: string;
}


export interface AdminOptions {
  registrantNotification: true;
  adminNotification: true;
  customEmail: "";
  resubmit: true;
}

export interface IAuthNetResponse {
    messages: {
      resultCode: string
      message: {
        code: string
        text: string
      }[]
    }
    transactionResponse: {
      authCode: string
      transId: string
      networkTransId: string
    }
    responseCode: string
  }

export interface WatersystemMembershipPayload {
  adminOptions?: AdminOptions;
  name: string;
  region: "Region 1" | "Region 2" | "Region 3" | "Region 4";
  office_hours: string;
  meters: number;
  url: string;
  board_meeting: string;
  funding: boolean;
  years: number;
  orwaag: boolean;
  // workmans_comp?: boolean;
  contacts: IContact[];
  county:
    | "Adair"
    | "Alfalfa"
    | "Atoka"
    | "Beaver"
    | "Beckham"
    | "Blaine"
    | "Bryan"
    | "Caddo"
    | "Canadian"
    | "Carter"
    | "Cherokee"
    | "Choctaw"
    | "Cimarron"
    | "Cleveland"
    | "Coal"
    | "Comanche"
    | "Cotton"
    | "Craig"
    | "Creek"
    | "Custer"
    | "Delaware"
    | "Dewey"
    | "Ellis"
    | "Garfield"
    | "Garvin"
    | "Grady"
    | "Grant"
    | "Greer"
    | "Harmon"
    | "Harper"
    | "Haskell"
    | "Hughes"
    | "Jackson"
    | "Jefferson"
    | "Johnston"
    | "Kay"
    | "Kingfisher"
    | "Kiowa"
    | "Latimer"
    | "LeFlore"
    | "Lincoln"
    | "Logan"
    | "Love"
    | "Major"
    | "Marshall"
    | "Mayes"
    | "McClain"
    | "McCurtain"
    | "McIntosh"
    | "Murray"
    | "Muskogee"
    | "Noble"
    | "Nowata"
    | "Okfuskee"
    | "Oklahoma"
    | "Okmulgee"
    | "Osage"
    | "Ottawa"
    | "Pawnee"
    | "Payne"
    | "Pittsburg"
    | "Pontotoc"
    | "Pottawatomie"
    | "Pushmataha"
    | "Roger Mills"
    | "Rogers"
    | "Seminole"
    | "Sequoyah"
    | "Stephens"
    | "Texas"
    | "Tillman"
    | "Tulsa"
    | "Wagoner"
    | "Washington"
    | "Washita"
    | "Woods"
    | "Woodward";
  total_years: number;
  member_type: "RWC" | "RWD" | "TN";
  system_type_dirty: Array<"Pur" | "Sur" | "Well" | "Sew">;
  email: string;
  phone: string;
  fax: string;
  latitude: string;
  longitude: string;
  address_mailing_pobox: string;
  address_mailing_city: string;
  address_mailing_state:
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
  address_mailing_zip: string;
  address_physical_line1: string;
  address_physical_line2: string;
  address_physical_city: string;
  address_physical_state:
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
  address_physical_zip: string;
  annual_report_type: "Digital" | "Mail" | "Both" | "None";
  membership_directory_type: "Digital" | "Mail" | "Both" | "None";
  payment_last_date: string; // ISO date string format
  payment_method: "Card" | "Invoice";
  payment_amount: number; // Decimal
  fee_connections: number; // Decimal
  fee_membership: number; // Decimal
  fee_scholarship: number; // Decimal
  fee_apprenticeship: number; // Decimal
  application_date?: string; // ISO date string format
  wp_uid: number;
  wp_eid: number;
  payment_details: string;
  legal_entity_name: string;
  // directory_sent_date?: string; // ISO date string format
  // soonerwarn: boolean;
  // directory_mailed?: boolean;
  // payment_previous_date?: string; // ISO date string format
  address_billing_line1: string;
  address_billing_line2: string;
  address_billing_city: string;
  address_billing_state: string;
  address_billing_zip: string;
  billing_email: string;
  billing_phone: string;
  billing_first_name: string;
  billing_last_name: string;
  payment_information?: PaymentInformation;
}

interface PaymentInformation {
  card: string;
  exp: string;
  cvv: string;
}


export const state_map = [
    { 'Alabama': 'AL' },
    { 'Alaska': 'AK' },
    { 'Arizona': 'AZ' },
    { 'Arkansas': 'AR' },
    { 'California': 'CA' },
    { 'Colorado': 'CO' },
    { 'Connecticut': 'CT' },
    { 'Delaware': 'DE' },
    { 'Florida': 'FL' },
    { 'Georgia': 'GA' },
    { 'Hawaii': 'HI' },
    { 'Idaho': 'ID' },
    { 'Illinois': 'IL' },
    { 'Indiana': 'IN' },
    { 'Iowa': 'IA' },
    { 'Kansas': 'KS' },
    { 'Kentucky': 'KY' },
    { 'Louisiana': 'LA' },
    { 'Maine': 'ME' },
    { 'Maryland': 'MD' },
    { 'Massachusetts': 'MA' },
    { 'Michigan': 'MI' },
    { 'Minnesota': 'MN' },
    { 'Mississippi': 'MS' },
    { 'Missouri': 'MO' },
    { 'Montana': 'MT' },
    { 'Nebraska': 'NE' },
    { 'Nevada': 'NV' },
    { 'New Hampshire': 'NH' },
    { 'New Jersey': 'NJ' },
    { 'New Mexico': 'NM' },
    { 'New York': 'NY' },
    { 'North Carolina': 'NC' },
    { 'North Dakota': 'ND' },
    { 'Ohio': 'OH' },
    { 'Oklahoma': 'OK' },
    { 'Oregon': 'OR' },
    { 'Pennsylvania': 'PA' },
    { 'Rhode Island': 'RI' },
    { 'South Carolina': 'SC' },
    { 'South Dakota': 'SD' },
    { 'Tennessee': 'TN' },
    { 'Texas': 'TX' },
    { 'Utah': 'UT' },
    { 'Vermont': 'VT' },
    { 'Virginia': 'VA' },
    { 'Washington': 'WA' },
    { 'West Virginia': 'WV' },
    { 'Wisconsin': 'WI' },
    { 'Wyoming': 'WY' }
  ];

  export interface waterSystemRenewalPayload extends WatersystemMembershipPayload {
    watersystem: string 
  }
  

  export interface AssociateMembershipPayload {
    adminOptions?: AdminOptions;
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
    website: string;
    logo: number[]
    contacts: IContact[];
    phone: string;
    total_years?: number;
    email: string;
    contact_primary: IContact;
    contact_secondary: IContact;
    mailing_address_street: string;
    mailing_address_city: string;
    mailing_address_state:
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
    annual_report_type: "Digital" | "Mail" | "Both" | "None";
    membership_directory_type: "Digital" | "Mail" | "Both" | "None";
    payment_last_date: string;
    payment_method?: "Card" | "eCheck" | "Invoice";
    payment_amount: number;
    fee_membership: number;
    fee_scholarship: number;
    fee_apprenticeship: number;
    payment_details: string;
    // wp_uid?: number;
    // wp_eid?: number;
    application_date: string;
    directory_mailed?: boolean;
    primary_ad?: number;
    payment_previous_date: string;
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