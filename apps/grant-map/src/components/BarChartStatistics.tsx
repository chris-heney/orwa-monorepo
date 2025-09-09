import { Bar } from "react-chartjs-2";
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

const BarChartStatistics = ({
    viewBy,
    fundType,
}: {
    viewBy: "county" | "project"; 
    fundType: "awarded" | "requested";
}) => {
  const { applications } = useAppContext();

  const calculateData = () => {
    if (viewBy === 'county') {
      const countyData: { [key: string]: { amount: number; count: number } } = {};
      applications
        .filter((currentApplication) => {
          return fundType === 'requested'
            ? true
            : [
                "Grant Agreement Signed/Sealed/Returned",
                "Paid in Full",
                "Revised per COR",
                "Authorized by DEQ",
                "Authorized by ORWA",
                "Committee Approved",
                "Award Letter Sent",
              ].includes(currentApplication.status.data.name);
        })
        .forEach((currentApplication) => {
          const county = currentApplication.county || 'Unknown';
          const amount =
            fundType === 'awarded'
              ? currentApplication.award_amount || 0
              : currentApplication.requested_grant_amount || 0;
  
          if (!countyData[county]) {
            countyData[county] = { amount: 0, count: 0 };
          }
          countyData[county].amount += Math.round(amount);
          countyData[county].count += 1; // Track number of applications per county
        });
  
      const sortedCounties = Object.keys(countyData).sort();
      const amounts = sortedCounties.map((county) => countyData[county].amount);
      const applicationCounts = sortedCounties.map((county) => countyData[county].count);
  
      return {
        chartData: {
          labels: sortedCounties,
          datasets: [
            {
              label: `Total Funds ${fundType === 'awarded' ? 'Awarded' : 'Requested'}`,
              data: amounts,
              backgroundColor:
                fundType === 'awarded' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(192, 75, 75, 0.6)',
              borderColor:
                fundType === 'awarded' ? 'rgba(75, 192, 192, 1)' : 'rgba(192, 75, 75, 1)',
              borderWidth: 1,
            },
          ],
        },
        applicationCounts,
      };
    } else {
      const projectData: { [key: string]: number } = {};
  
      applications.forEach((currentApplication) => {
        const relevantProjects =
          fundType === 'awarded'
            ? currentApplication.approved_projects?.data
            : currentApplication.selected_projects?.data;
  
        if (!relevantProjects) return;
  
        const amount =
          fundType === 'awarded'
            ? Math.round(currentApplication.award_amount) || 0
            : Math.round(currentApplication.requested_grant_amount) || 0;
  
        const numProjects = relevantProjects.length || 1;
        const distributedAmount = amount / numProjects;
  
        relevantProjects.forEach((project) => {
          if (project.classification !== 'Both') {
            const projectName = project.name || 'Unknown';
  
            if (!projectData[projectName]) {
              projectData[projectName] = 0;
            }
            projectData[projectName] += Math.round(distributedAmount);
          }
        });
      });
  
      const sortedProjects = Object.keys(projectData).sort();
      const amounts = sortedProjects.map((project) => projectData[project]);
  
      return {
        chartData: {
          labels: sortedProjects,
          datasets: [
            {
              label: `Total Funds ${fundType === 'awarded' ? 'Awarded' : 'Requested'}`,
              data: amounts,
              backgroundColor:
                fundType === 'awarded' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(192, 75, 75, 0.6)',
              borderColor:
                fundType === 'awarded' ? 'rgba(75, 192, 192, 1)' : 'rgba(192, 75, 75, 1)',
              borderWidth: 1,
            },
          ],
        },
      };
    }
  };
  
  const { chartData, applicationCounts } = calculateData();
  
  const options = {
    scales: {
      x: {
        ticks: {
          maxRotation: 60,
          minRotation: 60,
          autoSkip: false,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const labelName = tooltipItem.label;
            const totalFunds = tooltipItem.raw.toLocaleString();
            const index = tooltipItem.dataIndex;
            let extraInfo = '';
  
            if (viewBy === 'county' && applicationCounts) {
              const numApplications = applicationCounts[index] || 0;
              extraInfo = `Number of Applications: ${numApplications}`;
            } else {
              const relatedApplications = applications.filter((application) =>
                application.approved_projects?.data.some(
                  (project) => project.name === labelName
                )
              );
              const projectCount = relatedApplications.length;
              extraInfo = `Number of Projects: ${projectCount}`;
            }
  
            return [`Total Funds ${fundType === 'awarded' ? 'Awarded' : 'Requested'}: ${totalFunds}`, extraInfo];
          },
        },
      },
    },
    maintainAspectRatio: false,
  };
  
  return <Bar data={chartData} options={options as any} />
}

export default BarChartStatistics;