import { useState } from "react";
import {
  useEntryPayload,
  useFormSubmitted,
  useUserContext,
} from "../providers/MembershipContextProvider";
import { useGetSubmissions } from "../data/API";
import { WatersystemMembershipPayload } from "../types/WatersystemMebership";
import { AssociateMembershipPayload } from "../types/AssociateMembership";
import { entryPayload } from "../types";
import { useNavigate } from "react-router";
import EntryListSidebar from "./EntryListSidebar";
import { getFormRoute } from "../helpers/getFormRoute";
import { useEntryList } from "../providers/EntryListProvider";

const ITEMS_PER_PAGE = 10;

const EntryList = () => {
  const { data: submissions, status: submissionsStatus } = useGetSubmissions();
  const { setEntryPayload } = useEntryPayload();
  const { setSelectedSubmission } = useEntryList();
  const { setViewingEntries, setIsAdminView } = useUserContext();
  const { setIsFormSubmitted } = useFormSubmitted();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (submissionsStatus === "pending") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading submissions...
      </div>
    );
  }

  if (submissionsStatus === "error") {
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading submissions.
      </div>
    );
  }

  const filteredSubmissions = (submissions as unknown as entryPayload[]).filter(
    (submission) => {
      const searchLower = searchTerm.toLowerCase();

      // Check if the search term matches any of the fields
      const registrantName =
        `${submission.data?.billing_first_name} ${submission.data?.billing_last_name}`.toLowerCase() ||
        "";
      const organization = submission.data?.name?.toLowerCase() || "";
      const formType = submission.resource.toLowerCase();

      return (
        registrantName.includes(searchLower) ||
        organization.includes(searchLower) ||
        formType.includes(searchLower)
      );
    }
  );

  // Sort by `createdAt` instead of `id`
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    if (sortOrder === "asc") {
      return dateB - dateA; // Newest first
    } else {
      return dateA - dateB; // Oldest first
    }
  });

  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewEntry = (entry: {
    resource: string;
    data: WatersystemMembershipPayload | AssociateMembershipPayload;
  }) => {
    const { data } = entry;

    const requestData = {
      ...data,
    };

    navigate(getFormRoute(entry));
    setEntryPayload(requestData);
    setSelectedSubmission(entry as entryPayload);
    setViewingEntries(false);
    setIsAdminView(true);
    setIsFormSubmitted(false);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex justify-center min-h-screen py-4">
      <div className="w-full max-w-7xl">
        {/* Search Bar */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by registrant or organization..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table and Action Section */}
        <div className="gap-4 grid grid-cols-12">
          {/* Table Section */}
          <div className="flex-grow rounded-md overflow-auto col-span-9">
            <table className="border-collapse border border-gray-300 text-sm sm:text-base w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left cursor-pointer text-nowrap"
                    onClick={handleSort}
                  >
                    Date <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Form
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Registrant
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Organization
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left hidden sm:table-cell">
                    Payment Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission: entryPayload) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 even:bg-gray-50"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center text-nowrap">
                      {new Date(submission.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-nowrap">
                      {getFormRoute(
                        submission as {
                          resource: string;
                          data:
                            | WatersystemMembershipPayload
                            | AssociateMembershipPayload;
                        }
                      ).replace("/", "")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-nowrap">
                      {submission.data?.billing_first_name}{" "}
                      {submission.data?.billing_last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-nowrap">
                      {submission.data?.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 hidden sm:table-cell">
                      {submission.data?.payment_method}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white py-1 rounded hover:bg-blue-700 w-full text-nowrap"
                        onClick={() =>
                          handleViewEntry(
                            submission as {
                              resource: string;
                              data:
                                | WatersystemMembershipPayload
                                | AssociateMembershipPayload;
                            }
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-2 bg-gray-100">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <EntryListSidebar />
        </div>
      </div>
    </div>
  );
};

export default EntryList;