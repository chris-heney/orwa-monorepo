import { Button, CircularProgress } from "@mui/material";
import { useEditSession } from "../providers/EditSessionProvider";

const LandingView = () => {
  const { startNewApplication, beginModify, isLoadingSession } =
    useEditSession();

  return (
    <main className="flex flex-col items-center text-center px-4 py-12 md:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          ORWA Grant Application
        </h1>
        <p className="text-gray-600 mb-10">
          Welcome to the Oklahoma Rural Water Association grant application
          portal. Start a new application, or make changes to an application
          you have already submitted &mdash; applications can be modified up
          until they enter processing.
        </p>

        {isLoadingSession ? (
          <div className="flex flex-col items-center gap-3">
            <CircularProgress />
            <p className="text-gray-500">Loading your application...</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="w-full sm:w-64"
              onClick={startNewApplication}
            >
              Start New Application
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="w-full sm:w-64"
              onClick={beginModify}
            >
              Modify Existing Application
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default LandingView;
