import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface FilterProps {
  setCategoryFilter: (category: string) => void
  categoryFilter: string
}

export const CategorySelect: React.FC<FilterProps> = ({ categoryFilter, setCategoryFilter}) => {


  const menuItems = [
    "Accountant",
    "Attorneys Bond Counsel",
    "Automated Controls",
    "Automatic Flushing",
    "Automatic Meter Reading",
    "Automotive Dealer",
    "CNG",
    "Car Dealership",
    "Commercial",
    "Communications",
    "Community Service",
    "Computers and Software",
    "Construction",
    "Consulting Service",
    "Control Valve Sales and Service",
    "Damage Prevention",
    "Distributor",
    "Electric Motor and Pump Repair",
    "Electronic Fusion",
    "Engineer",
    "Environmental Service",
    "Equipment Service Rental and Sales",
    "Financial Service",
    "Flow Meters",
    "GIS",
    "GPS Mapping and Survey Equipment",
    "Geophysical Water Well Logging",
    "Government Accounting Software",
    "Health Care",
    "Insurance",
    "Lagoon Cleanouts",
    "Landscape and Lawn Care",
    "Manufacturer",
    "Manufactures Rep",
    "Mechanical/Plumbing and Maintenance",
    "Meter and Automation",
    "Meters and Meter Reading Equipment",
    "Motor Carriers",
    "Motor and Pump Repair",
    "Municipal Services",
    "Non-Destructive Testing",
    "Oil Field Construction",
    "Oilfield Flowback Services",
    "Oilfield Service Company",
    "Other",
    "Painting and Coatings",
    "Print and Mail Services",
    "Pumps",
    "Rail Car Maintenance and Repair",
    "Ranching",
    "Residential and Industrial",
    "Roofing",
    "SCADA/Telemetry",
    "Sales Representative",
    "Sales Representatives",
    "Sanitary Sewer Evaluation Services",
    "Software and Supplies",
    "Storage Tanks",
    "Suppliers",
    "Tank Inspection",
    "Tank Maintenance",
    "Training",
    "Truck Equipment",
    "Valves",
    "Vehicles",
    "Water Analysis",
    "Water Metering",
    "Water Meters",
    "Water Operator Training",
    "Water Tanks",
    "Water Treatment",
    "Water Well Drilling and Pump Installation",
    "Website Provider",
    "Welding/Fabrication"
  ]
  

  const handleChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value as string);
  }

  return (
    <FormControl className="w-full lg:w-96">
      <InputLabel id="demo-simple-select-label">Categories</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select-filled"
        fullWidth
        value={categoryFilter}
        label="All Category"
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
            },
          },
        }}
      >
        <MenuItem value={''}>All Categories</MenuItem>
        {menuItems.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}