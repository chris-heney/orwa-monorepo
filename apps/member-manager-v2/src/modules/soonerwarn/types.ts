import { IContact } from "../training/_types";

export interface ISoonerwarnApplication {
    id: number;
    system_name: string;
    physical_address_street: string;
    physical_address_city: string;
    physical_address_state: 
      | "Alabama" | "Alaska" | "Arizona" | "Arkansas" | "California" | "Colorado"
      | "Connecticut" | "Delaware" | "Florida" | "Georgia" | "Hawaii" | "Idaho"
      | "Illinois" | "Indiana" | "Iowa" | "Kansas" | "Kentucky" | "Louisiana"
      | "Maine" | "Maryland" | "Massachusetts" | "Michigan" | "Minnesota"
      | "Mississippi" | "Missouri" | "Montana" | "Nebraska" | "Nevada"
      | "New Hampshire" | "New Jersey" | "New Mexico" | "New York"
      | "North Carolina" | "North Dakota" | "Ohio" | "Oklahoma" | "Oregon"
      | "Pennsylvania" | "Rhode Island" | "South Carolina" | "South Dakota"
      | "Tennessee" | "Texas" | "Utah" | "Vermont" | "Virginia" | "Washington"
      | "West Virginia" | "Wisconsin" | "Wyoming";
    physical_address_zip: string;
    application_date: string;
    contacts: Array<IContact>; 
    county: 
      | "Adair" | "Alfalfa" | "Atoka" | "Beaver" | "Beckham" | "Blaine" | "Bryan"
      | "Caddo" | "Canadian" | "Carter" | "Cherokee" | "Choctaw" | "Cimarron"
      | "Cleveland" | "Coal" | "Comanche" | "Cotton" | "Craig" | "Creek"
      | "Custer" | "Delaware" | "Dewey" | "Ellis" | "Garfield" | "Garvin"
      | "Grady" | "Grant" | "Greer" | "Harmon" | "Harper" | "Haskell" | "Hughes"
      | "Jackson" | "Jefferson" | "Johnston" | "Kay" | "Kingfisher" | "Kiowa"
      | "Latimer" | "LeFlore" | "Lincoln" | "Logan" | "Love" | "Major" | "Marshall"
      | "Mayes" | "McClain" | "McCurtain" | "McIntosh" | "Murray" | "Muskogee"
      | "Noble" | "Nowata" | "Okfuskee" | "Oklahoma" | "Okmulgee" | "Osage"
      | "Ottawa" | "Pawnee" | "Payne" | "Pittsburg" | "Pontotoc" | "Pottawatomie"
      | "Pushmataha" | "Roger Mills" | "Rogers" | "Seminole" | "Sequoyah"
      | "Stephens" | "Texas" | "Tillman" | "Tulsa" | "Wagoner" | "Washington"
      | "Washita" | "Woods" | "Woodward";
    location: Record<string, any>;
    email: string;
    phone: string;
    status: ISoonerwarnStatus; 
  }

  interface ISoonerwarnStatus {
    id: string;
    name: string;
    description: string
    color: string;
    order: number;
  }
  