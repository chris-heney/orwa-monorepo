import React, { useEffect, useRef } from "react";
import { Card, Box, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Loading, useGetList } from "react-admin";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { oneYearAgoFormatted } from "../helpers/activeOrInactiveMembership";
import { Chart } from "chart.js/dist";

// Register Chart.js components (required for react-chartjs-2 v4+)
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MembershipReportCard = () => {
  const chartRef = useRef(null);

  const { data: associates, isLoading: isAssociatesLoading } = useGetList(
    "associates",
    {
      meta: {
        raw: true,
      },
      filter: {
        payment_last_date: {
          value: oneYearAgoFormatted,
          operator: "$lt",
          checkForNull: true,
          fieldToCheck: "payment_last_date",
        },
      },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  const { data: watersystems, isLoading: isWaterSystemsLoading } = useGetList(
    "watersystems",
    {
      meta: {
        raw: true,
      },
      filter: {
        payment_last_date: {
          value: oneYearAgoFormatted,
          operator: "$lt",
          checkForNull: true,
          fieldToCheck: "payment_last_date",
        },
      },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  const membershipData = {
    2021: { systems: 529, associates: 111 },
    2022: { systems: 380, associates: 96 },
    2023: { systems: 458, associates: 104 },
    2024: {
      systems: watersystems?.length || 0,
      associates: associates?.length || 0,
    },
  };

  const chartData = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Water Systems",
        data: Object.values(membershipData).map((data) => data.systems),
        backgroundColor: "#2196F3",
      },
      {
        label: "Associates",
        data: Object.values(membershipData).map((data) => data.associates),
        backgroundColor: "#FF9800",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF", // Set y-axis tick color to white
        },
      },
      x: {
        ticks: {
          color: "#FFFFFF", // Set x-axis tick color to white
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF", // Legend text color
        },
      },
    },
  };

  // Cleanup Chart.js instances on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        (chartRef.current as Chart).destroy();
      }
    };
  }, []);

  return isAssociatesLoading || isWaterSystemsLoading ? (
    <Loading />
  ) : (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        backgroundColor: "#474747", // Black background
        color: "#ffffff", // White text color
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Box
        sx={{
          py: 1,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <AssessmentIcon sx={{ fontSize: 30 }} />
        <Typography ml={2} textAlign={"center"} variant="h5">
          Membership Report
        </Typography>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          height: "300px", // Set height for the chart
        }}
      >
        <Bar ref={chartRef} data={chartData} options={chartOptions} />
      </Box>
    </Card>
  );
};

export default MembershipReportCard;


// @Flow-Up12 TODO need to come up with a strategy for dynamically displaying memberships throughout the years
// Test Approach 
// Previously we only had payment_last_date and payment_previous_date which only allowed for a maximum of two years calculations
// we now have a transactions collection... this could be used for a new way of calculating members throughout the years

// import React, { useEffect, useRef, useMemo } from "react";
// import { Card, Box, Typography } from "@mui/material";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import { Loading, useGetList } from "react-admin";
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { oneYearAgoFormatted } from "../helpers/activeOrInactiveMembership";
// import { Chart } from "chart.js/dist";

// // Register Chart.js components (required for react-chartjs-2 v4+)
// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// // Define the structure for membership data
// interface MembershipData {
//   [year: string]: {
//     systems: number;
//     associates: number;
//   };
// }

// const MembershipReportCard = () => {
//   const chartRef = useRef(null);

//   const { data: associates, isLoading: isAssociatesLoading } = useGetList(
//     "associates",
//     {
//       meta: {
//         raw: true,
//       },
//       filter: {
//         payment_last_date: {
//           value: oneYearAgoFormatted,
//           operator: "$lt",
//           checkForNull: true,
//           fieldToCheck: "payment_last_date",
//         },
//       },
//       pagination: { page: 1, perPage: 1000 },
//     }
//   );

//   const { data: watersystems, isLoading: isWaterSystemsLoading } = useGetList(
//     "watersystems",
//     {
//       meta: {
//         raw: true,
//       },
//       filter: {
//         payment_last_date: {
//           value: oneYearAgoFormatted,
//           operator: "$lt",
//           checkForNull: true,
//           fieldToCheck: "payment_last_date",
//         },
//       },
//       pagination: { page: 1, perPage: 1000 },
//     }
//   );

//   // Create a dynamic membership data object based on unique years
//   const membershipData = useMemo(() => {
//     const allYears = new Set<string>();
  
//     // Collect years from hardcoded data
//     const staticData: MembershipData = {
//       "2021": { systems: 529, associates: 111 },
//       "2022": { systems: 380, associates: 96 },
//       "2023": { systems: 458, associates: 104 },
//     };
//     Object.keys(staticData).forEach((year) => allYears.add(year));
  
//     // Dynamically add years between the latest static year and the current year
//     const currentYear = new Date().getFullYear();
//     const latestStaticYear = Math.max(...Object.keys(staticData).map(Number));
  
//     for (let year = latestStaticYear + 1; year <= currentYear; year++) {
//       allYears.add(year.toString());
//     }
  
//     // Create dynamic data for missing years
//     const dynamicData: MembershipData = {};
//     Array.from(allYears).forEach((year) => {
//       if (!staticData[year]) {
//         dynamicData[year] = {
//           systems: watersystems?.length || 0,
//           associates: associates?.length || 0,
//         };
//       }
//     });
  
//     // Combine static and dynamic data
//     const allData: MembershipData = { ...staticData, ...dynamicData };
  
//     return { years: Array.from(allYears).sort(), data: allData };
//   }, [watersystems, associates]);

//   const chartData = useMemo(() => {
//     return {
//       labels: membershipData.years,
//       datasets: [
//         {
//           label: "Water Systems",
//           data: membershipData.years.map((year) => membershipData.data[year]?.systems || 0),
//           backgroundColor: "#2196F3",
//         },
//         {
//           label: "Associates",
//           data: membershipData.years.map((year) => membershipData.data[year]?.associates || 0),
//           backgroundColor: "#FF9800",
//         },
//       ],
//     };
//   }, [membershipData]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           color: "#FFFFFF", // Set y-axis tick color to white
//         },
//       },
//       x: {
//         ticks: {
//           color: "#FFFFFF", // Set x-axis tick color to white
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         labels: {
//           color: "#FFFFFF", // Legend text color
//         },
//       },
//     },
//   };

//   // Cleanup Chart.js instances on unmount
//   useEffect(() => {
//     return () => {
//       if (chartRef.current) {
//         (chartRef.current as Chart).destroy();
//       }
//     };
//   }, []);

//   return isAssociatesLoading || isWaterSystemsLoading ? (
//     <Loading />
//   ) : (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: "10px",
//         backgroundColor: "#474747", // Black background
//         color: "#ffffff", // White text color
//         position: "relative",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
//       }}
//     >
//       <Box
//         sx={{
//           py: 1,
//           px: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-start",
//         }}
//       >
//         <AssessmentIcon sx={{ fontSize: 30 }} />
//         <Typography ml={2} textAlign={"center"} variant="h5">
//           Membership Report
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           textAlign: "center",
//           height: "300px", // Set height for the chart
//         }}
//       >
//         <Bar ref={chartRef} data={chartData} options={chartOptions} />
//       </Box>
//     </Card>
//   );
// };

// export default MembershipReportCard;