import { useState } from "react";
import { useGetSubmissions } from "../data/API";
import { entryPayload, IScholarshipApplicationPayload } from "../types/types";
import { useEntryList } from "../providers/EntryListProvider";
import EntryListSidebar from "./EntryListSidebar";
import { useUserContext } from "../providers/UserContextProvider";
import { useEntryPayload } from "../providers/AppContextProvider";

const ITEMS_PER_PAGE = 10;

const EntryList = () => {
  const { data: submissions, status: submissionsStatus } = useGetSubmissions();
  const { setEntryPayload } = useEntryPayload();
  const { setSelectedSubmission } = useEntryList();
  const { setViewingEntries, setIsAdminView } = useUserContext();

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
      const applicantName = `${submission.data?.applicant_first_name || ""} ${
        submission.data?.applicant_last_name || ""
      }`.toLowerCase();
      const systemName = (submission.data?.system_name || "").toLowerCase();
      return (
        applicantName.includes(searchLower) || systemName.includes(searchLower)
      );
    }
  );

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE) || 1;
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewEntry = (entry: {
    resource: string;
    data: IScholarshipApplicationPayload;
  }) => {
    setEntryPayload(entry.data);
    setSelectedSubmission(entry as entryPayload);
    setViewingEntries(false);
    setIsAdminView(true);
  };

  return (
    <div className="flex justify-center min-h-screen py-4">
      <div className="w-full max-w-7xl">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by applicant or water system..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="gap-4 grid grid-cols-12">
          <div className="flex-grow rounded-md overflow-auto col-span-9">
            <table className="border-collapse border border-gray-300 text-sm sm:text-base w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Applicant
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Water System
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission: entryPayload) => (
                  <tr
                    key={String(submission.id)}
                    className="hover:bg-gray-50 even:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(submission.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {submission.data?.applicant_first_name}{" "}
                      {submission.data?.applicant_last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {submission.data?.system_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white py-1 rounded hover:bg-blue-700 w-full cursor-pointer"
                        onClick={() =>
                          handleViewEntry(
                            submission as {
                              resource: string;
                              data: IScholarshipApplicationPayload;
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
            <div className="flex justify-between items-center p-2 bg-gray-100">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 cursor-pointer"
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
