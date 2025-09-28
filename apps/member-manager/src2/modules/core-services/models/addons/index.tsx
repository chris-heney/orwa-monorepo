// import CreateAddon from './CreateAddonModal'
import EditAddon from './EditAddon'
import AddonList from './AddonList'
import GradingIcon from '@mui/icons-material/Grading'
import AddonFormFields from './AddonFormFields'

export { 
    AddonFormFields,
}

export default {
    list: AddonList,
    // create: CreateAddon,
    edit: EditAddon,
    icon: GradingIcon,
    recordRepresentation: 'title',
} 