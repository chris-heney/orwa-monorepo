import React from "react";
import { Create, useGetList, useStore } from "react-admin";
import AwardTypeForm from "./AwardTypeForm";
import { reviewResourceSx } from "../../_components/review-packet";
import type { AwardTypeRecord } from "../helpers/awardTypes";

const SETTINGS_TAB = "settings" as const;

const AwardTypeCreate = () => {
  const [, setTab] = useStore("orwa-awards-tab-value", SETTINGS_TAB);
  const { data } = useGetList<AwardTypeRecord>("award-types", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "order", order: "ASC" },
  });
  const nextOrder =
    (data || []).reduce((max, row) => Math.max(max, row.order ?? 0), 0) + 10;

  return (
    <Create
      title="Add Award Type"
      component="div"
      actions={false}
      redirect={() => {
        setTab(SETTINGS_TAB);
        return "/orwa-awards/dashboard";
      }}
      transform={(data) => ({
        ...data,
        order: typeof data.order === "number" ? data.order : nextOrder,
      })}
      sx={reviewResourceSx}
    >
      <AwardTypeForm />
    </Create>
  );
};

export default AwardTypeCreate;
