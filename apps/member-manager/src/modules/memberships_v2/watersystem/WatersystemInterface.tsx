import { Identifier } from 'react-admin';
import { IContact } from '../../training/_types';


  export interface IWatersystem {
    id: Identifier;
    name: string;
    region?: "Region 1" | "Region 2" | "Region 3" | "Region 4" | "";
    office_hours?: string;
    meters: number;
    url?: string;
    board_meeting?: string;
    funding?: boolean;
    orwaag?: boolean;
    workmans_comp?: boolean;
    contacts?: IContact[];
    county?:
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
    system_type_dirty: string;
    email: string;
    phone: string;
    fax: string;
    // latitude: string;
    // longitude: string;
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
    application_date?: string; // ISO date string format
    wp_uid: number;
    wp_eid: number;
    payment_details: string;
    legal_entity_name: string;
    directory_sent_date?: string; // ISO date string format
    soonerwarn: boolean;
    directory_mailed?: boolean;
    payment_previous_date?: string; // ISO date string format
  }