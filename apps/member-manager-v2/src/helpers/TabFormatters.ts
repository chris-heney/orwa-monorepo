import { Direction } from "@mui/material"
import { theme } from "@react-admin/ra-navigation"

export const a11yTabProps = (index: number) => {

    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    }
  }
  
export const a11yTabPanelProps = (index: number) => {
    return {
      id: `full-width-tabpanel-${index}`,
      'aria-labelledby': `full-width-tab-${index}`,
      dir: `${theme.direction as Direction}`,
      sx: { p: 0 }
    }
  }
  