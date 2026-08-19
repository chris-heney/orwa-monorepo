import SchoolIcon from "@mui/icons-material/School";
import ScholarshipApplicationList from "./components/ScholarshipApplicationList";
import ScholarshipEdit from "./components/ScholarshipEdit";
import ScholarshipShow from "./components/ScholarshipShow";

export default {
  list: ScholarshipApplicationList,
  edit: ScholarshipEdit,
  show: ScholarshipShow,
  icon: SchoolIcon,
  recordRepresentation: (record: {
    applicant_first_name?: string;
    applicant_last_name?: string;
  }) =>
    `${record.applicant_first_name || ""} ${record.applicant_last_name || ""}`.trim(),
};
