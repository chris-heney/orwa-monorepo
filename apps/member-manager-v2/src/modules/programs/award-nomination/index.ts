import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AwardNominationDashboard from './AwardNominationDashboard';
import CreateAwardNomination from './CreateAwardNomination';
import EditAwardNomination from './EditAwardNomination';
import AwardNominationShow from './AwardNominationShow';
import { IAwardNomination } from './AwardNominationTypes';

export default {
  list: AwardNominationDashboard,
  create: CreateAwardNomination,
  edit: EditAwardNomination,
  show: AwardNominationShow,
  icon: EmojiEventsIcon,
  recordRepresentation: (record: IAwardNomination) => 
    `${record.nominee_name} - ${record.award_type}`,
};
