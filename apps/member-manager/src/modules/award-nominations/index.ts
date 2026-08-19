import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AwardNominationList from "./components/AwardNominationList";
import AwardEdit from "./components/AwardEdit";
import AwardShow from "./components/AwardShow";

export default {
  list: AwardNominationList,
  edit: AwardEdit,
  show: AwardShow,
  icon: EmojiEventsIcon,
  recordRepresentation: "nominee_name",
};
