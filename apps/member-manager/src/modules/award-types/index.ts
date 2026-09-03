import CategoryIcon from "@mui/icons-material/Category";
import AwardTypeSettings from "../award-nominations/components/AwardTypeSettings";
import AwardTypeCreate from "../award-nominations/components/AwardTypeCreate";
import AwardTypeEdit from "../award-nominations/components/AwardTypeEdit";

export default {
  list: AwardTypeSettings,
  create: AwardTypeCreate,
  edit: AwardTypeEdit,
  icon: CategoryIcon,
  recordRepresentation: "name",
};
