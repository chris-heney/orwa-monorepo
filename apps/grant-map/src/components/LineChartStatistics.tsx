import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  // ChartOptions,
} from "chart.js";
import { useAppContext } from "../providers/AppContext";

// Register components with ChartJS
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChartStatistics = ({ viewBy }: { viewBy: "county" | "project" }) => {

  const { applications } = useAppContext();

  const calculateData = () => {
    if (viewBy === "county") {
      const countyData = applications.reduce((acc, currentApplication) => {
        const county = currentApplication.county || "Unknown";
        const awardedAmount = currentApplication.award_amount || 0;
        const requestedAmount = currentApplication.requested_grant_amount
          ? parseInt(currentApplication.requested_grant_amount.toString())
          : 0;

        if (!acc[county]) {
          acc[county] = { awarded: 0, requested: 0 };
        }

        acc[county].awarded += awardedAmount;
        acc[county].requested += requestedAmount;

        return acc;
      }, {} as { [key: string]: { awarded: number; requested: number } });

      const sortedCounties = Object.keys(countyData).sort();
      const awardedAmounts = sortedCounties.map(
        (county) => Math.round(countyData[county].awarded)
      );
      const requestedAmounts = sortedCounties.map(
        (county) => Math.round(countyData[county].requested)
      );

      return {
        labels: sortedCounties,
        datasets: [
          {
            label: "Total Funds Awarded",
            data: awardedAmounts,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderWidth: 2,
            fill: "origin", // Fill area from the origin to this line
          },
          {
            label: "Total Funds Requested",
            data: requestedAmounts,
            borderColor: "rgba(192, 75, 75, 1)",
            backgroundColor: "rgba(192, 75, 75, 0.6)",
            borderWidth: 2,
            fill: "-1", // Fill area between this line and the previous dataset
          },
        ],
      };
    } else {
      const projectData = applications.reduce((acc, currentApplication) => {
        currentApplication.approved_projects?.data.forEach((project) => {
          if (project.classification !== "Both") {
            const projectName = project.name || "Unknown";
            const awardedAmount = currentApplication.award_amount || 0;
            const requestedAmount = currentApplication.requested_grant_amount
              ? parseInt(currentApplication.requested_grant_amount.toString())
              : 0;

            const numProjects = currentApplication.approved_projects?.data.length || 1;

            if (!acc[projectName]) {
              acc[projectName] = { awarded: 0, requested: 0 };
            }

            acc[projectName].awarded += awardedAmount / numProjects;
            acc[projectName].requested += requestedAmount / numProjects;
          }
        });
        return acc;
      }, {} as { [key: string]: { awarded: number; requested: number } });

      const sortedProjects = Object.keys(projectData).sort();
      const awardedAmounts = sortedProjects.map(
        (project) => Math.round(projectData[project].awarded)
      );
      const requestedAmounts = sortedProjects.map(
        (project) => Math.round(projectData[project].requested)
      );

      return {
        labels: sortedProjects,
        datasets: [
          {
            label: "Total Funds Awarded",
            data: awardedAmounts,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderWidth: 2,
            fill: "origin", // Fill area from the origin to this line
          },
          {
            label: "Total Funds Requested",
            data: requestedAmounts,
            borderColor: "rgba(192, 75, 75, 1)",
            backgroundColor: "rgba(192, 75, 75, 0.6)",
            borderWidth: 2,
            fill: "-1", // Fill area between this line and the previous dataset
          },
        ],
      };
    }
  };

  const chartData = calculateData();

  const options = {
    scales: {
      x: {
        ticks: {
          maxRotation: 60, // Rotate labels more to make them fit
          minRotation: 60,
          autoSkip: false,
          font: {
            size: 10, // Adjust font size
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
  };

  return <Line data={chartData} options={options as any} />;
};

export default LineChartStatistics;
