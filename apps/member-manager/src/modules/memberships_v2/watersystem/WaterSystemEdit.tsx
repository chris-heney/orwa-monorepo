import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import {
  EditBase,
  RaRecord,
  SimpleForm,
  Title,
  useNotify,
  useRecordContext,
} from "react-admin";
import { RecordContextProvider } from "ra-core";
import MembershipsContextProvider from "../../memberships_v2/MembershipsContextProvider";
import { Grid, Button, Tooltip } from "@mui/material";
import WaterSystemFields from "./components/WaterSystemFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import { EmailSideBar } from "../../emails-magement";

/** ReferenceArrayInput expects `contacts` as id[]; Strapi `raw`+populate returns full objects. */
function normalizeWatersystemContactsForForm(
  record: RaRecord | undefined
): RaRecord | undefined {
  if (!record) return undefined;
  const raw = record.contacts;
  if (!Array.isArray(raw)) return record;
  const contacts = raw.map((item) =>
    item != null && typeof item === "object" && "id" in item
      ? (item as { id: number }).id
      : item
  );
  return { ...record, contacts };
}

/**
 * Re-provide record so SimpleForm / ReferenceArrayInput see `contacts` as numeric ids.
 * (The `format` prop on ReferenceArrayInput is not applied by useReferenceArrayInputController.)
 */
const WatersystemEditRecordContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const record = useRecordContext();
  const normalized = useMemo(
    () => normalizeWatersystemContactsForForm(record),
    [record]
  );
  if (record == null) {
    return <>{children}</>;
  }
  return (
    <RecordContextProvider value={normalized}>{children}</RecordContextProvider>
  );
};

/** Must match getOne `queryOptions.meta` so react-query merges / invalidation target the same cache entry. */
const WATERSYSTEM_EDIT_QUERY_META = {
  raw: true,
  populate: ["contacts"],
} as const;

const WaterSystemEdit = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const queryClient = useQueryClient();
  const notify = useNotify();

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <MembershipsContextProvider>
      <EditBase
        hasShow={false}
        redirect={false}
        component="div"
        mutationMode="pessimistic"
        queryOptions={{
          meta: WATERSYSTEM_EDIT_QUERY_META,
        }}
        mutationOptions={{
          meta: WATERSYSTEM_EDIT_QUERY_META,
          onSuccess: () => {
            notify("ra.notification.updated", {
              type: "info",
              messageArgs: { smart_count: 1 },
            });
            // Defer invalidation until after RHF clears isSubmitting; otherwise a
            // same-tick getOne refetch + form `values` sync can leave Save spinning.
            setTimeout(() => {
              void queryClient.invalidateQueries({
                queryKey: ["watersystems"],
              });
            }, 0);
          },
        }}
      >
        <Title title="Memberships" />
        <Grid container spacing={0}>
          <Grid item xs={12} md={showSidebar ? 9 : 12}>
            <WatersystemEditRecordContext>
              <SimpleForm sx={{ p: 0, m: 0 }}>
                <CustomFormHeader
                  customActions={
                    <Tooltip title="Open Notifications" placement="top">
                      <Button
                        onClick={toggleSidebar}
                        sx={{ color: "white", mr: 2 }}
                        startIcon={<MarkunreadMailboxIcon />}
                      ></Button>
                    </Tooltip>
                  }
                />
                <WaterSystemFields />
              </SimpleForm>
            </WatersystemEditRecordContext>
          </Grid>

          {/* Sidebar toggle logic */}
          {showSidebar && (
            <Grid item xs={12} md={3}>
              <EmailSideBar module="Memberships" />
            </Grid>
          )}
        </Grid>
      </EditBase>
    </MembershipsContextProvider>
  );
};

export default WaterSystemEdit;
