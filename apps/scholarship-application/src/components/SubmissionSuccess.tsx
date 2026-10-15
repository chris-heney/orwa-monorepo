import type { SubmittedApplicationSummary } from "../types/types";

interface SubmissionSuccessProps {
  summary: SubmittedApplicationSummary | null;
  onStartAnother: () => void;
}

/**
 * Post-submit confirmation that replaces the wizard (mirrors the ORWA Awards
 * nomination success screen). Everything the applicant needs to know is on
 * one card: who/what was submitted, where the confirmation went, what
 * happens next, and how to begin a new application.
 */
const SubmissionSuccess = ({ summary, onStartAnother }: SubmissionSuccessProps) => {
  const name = summary?.applicantName?.trim();
  const email = summary?.applicantEmail?.trim();
  const year = summary?.scholarshipYear;

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      data-testid="submission-success"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-center">
          <div className="bg-gradient-to-r from-green-400 to-green-500 h-2" />
          <div className="p-6 sm:p-10 lg:p-12">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Application Submitted
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Thank you{name ? `, ${name}` : ""}. Your ORWEF Scholarship
              application has been received.
            </p>

            {/* Submission summary */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-6">
              {name && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Applicant
                  </dt>
                  <dd
                    className="m-0 text-base font-semibold text-gray-900 break-words"
                    data-testid="success-applicant"
                  >
                    {name}
                  </dd>
                </div>
              )}
              {year && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Scholarship
                  </dt>
                  <dd
                    className="m-0 text-base font-semibold text-gray-900"
                    data-testid="success-year"
                  >
                    Year: {year}
                  </dd>
                </div>
              )}
              {email && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Confirmation sent to
                  </dt>
                  <dd
                    className="m-0 text-base font-semibold text-gray-900 break-all"
                    data-testid="success-email"
                  >
                    {email}
                  </dd>
                </div>
              )}
              {summary?.documentId && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reference
                  </dt>
                  <dd
                    className="m-0 text-sm font-mono text-gray-700 break-all"
                    data-testid="success-reference"
                  >
                    {summary.documentId}
                  </dd>
                </div>
              )}
            </dl>

            <p className="text-sm sm:text-base text-gray-600 mb-8">
              A confirmation email with a PDF copy of your application has been
              sent{email ? ` to ${email}` : " to the email address you provided"}.
              Please keep it for your records.
            </p>

            {/* What happens next */}
            <div className="bg-blue-50 rounded-lg p-5 sm:p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                What happens next?
              </h2>
              <ol
                className="text-left text-blue-800 space-y-2"
                style={{
                  listStyleType: "decimal",
                  listStylePosition: "outside",
                  paddingLeft: "1.625rem",
                  margin: 0,
                }}
              >
                <li style={{ display: "list-item" }}>
                  You will receive an email confirmation shortly
                </li>
                <li style={{ display: "list-item" }}>
                  We will contact you if we need any additional information
                </li>
                <li style={{ display: "list-item" }}>
                  Your application will be reviewed by the ORWEF scholarship
                  committee
                </li>
                <li style={{ display: "list-item" }}>
                  Scholarship recipients will be notified in late spring
                </li>
              </ol>
            </div>

            {/* Start another */}
            <button
              type="button"
              onClick={onStartAnother}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer mb-8"
            >
              Start another application
            </button>

            {/* Contact Information */}
            <div className="text-sm text-gray-500">
              <p className="m-0">If you have any questions, please contact us at:</p>
              <p className="m-0 font-semibold">
                <a
                  href="mailto:scholarships@orwa.org"
                  className="text-blue-700 hover:underline"
                >
                  scholarships@orwa.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionSuccess;
