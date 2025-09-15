import { booleanFilter, dateFilter, textFilter } from "@react-admin/ra-form-layout";

export const waterSystemFiltersConfig = {
    name: textFilter(),
    region: textFilter(),
    county: textFilter(),
    member_type: textFilter(),
    system_type_dirty: textFilter(),
    office_hours: textFilter(),
    url: textFilter(),
    board_meeting: textFilter(),
    funding: booleanFilter(),
    orwaag: booleanFilter(),
    workmans_comp: booleanFilter(),
    soonerwarn: booleanFilter(),
    directory_mailed: booleanFilter(),
    email: textFilter(),
    phone: textFilter(),
    fax: textFilter(),
    payment_method: textFilter(),
    membership_directory_type: textFilter(),
    payment_last_date: dateFilter(),
    application_date: dateFilter(),
    directory_sent_date: dateFilter(),
    payment_previous_date: dateFilter(),
  };
  