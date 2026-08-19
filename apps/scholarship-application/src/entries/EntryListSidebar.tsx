import { useEntryList } from "../providers/EntryListProvider";

const EntryListSidebar = () => {
  const { selectedSubmission, adminOptions, updateAdminOptions } =
    useEntryList();

  return (
    <aside className="col-span-3 rounded-md border border-gray-200 bg-white p-4 text-left">
      <h3 className="text-lg font-semibold mb-3">Admin options</h3>
      {selectedSubmission ? (
        <p className="text-sm text-gray-600 mb-4">
          {selectedSubmission.data?.applicant_first_name}{" "}
          {selectedSubmission.data?.applicant_last_name}
        </p>
      ) : (
        <p className="text-sm text-gray-500 mb-4">Select a submission.</p>
      )}
      <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded px-2 py-2">
        <input
          type="checkbox"
          checked={adminOptions.registrantNotification}
          onChange={() =>
            updateAdminOptions({
              registrantNotification: !adminOptions.registrantNotification,
            })
          }
        />
        Email applicant
      </label>
      <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded px-2 py-2">
        <input
          type="checkbox"
          checked={adminOptions.adminNotification}
          onChange={() =>
            updateAdminOptions({
              adminNotification: !adminOptions.adminNotification,
            })
          }
        />
        Email scholarships@orwa.org
      </label>
      <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded px-2 py-2">
        <input
          type="checkbox"
          checked={adminOptions.resubmit}
          onChange={() =>
            updateAdminOptions({ resubmit: !adminOptions.resubmit })
          }
        />
        Create / resubmit record
      </label>
    </aside>
  );
};

export default EntryListSidebar;
