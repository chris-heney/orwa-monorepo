import { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  Button,
  Paper,
  Slide,
  MenuItem,
  Select,
} from "@mui/material";
import { useAppContext } from "../providers/AppContext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LineChartStatistics from "./LineChartStatistics";
import BarChartStatistics from "./BarChartStatistics";
import StarburstChart from "./StarburstChart";
import CloseIcon from "@mui/icons-material/Close";

// Register components with ChartJS
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const { applications, setOpenStatistics, openStatistics } = useAppContext();
  const [viewBy, setViewBy] = useState<"county" | "project">("county"); // State to toggle view
  const [fundType, setFundType] = useState<"awarded" | "requested">("awarded"); // State to toggle between awarded and requested funds
  const [chartType, setChartType] = useState<"bar" | "line" | "starburst">(
    "bar"
  ); // State to toggle between Bar, Line, and Starburst charts
  const [fullScreen, setFullScreen] = useState(false); // State to toggle full screen mode

  const calculateTotalFunds = () => {
    let totalFunds = 0;
  
    applications
      .filter((app) => {
        if (fundType === "requested") {
          return (
            !["Not Approved", "Change Order"].includes(
              app.status.data.name
            ) && !app.status.data.name.includes("PFY") // Exclude any status with PFY
          );
        } else {
          return [
            "Grant Agreement Signed/Sealed/Returned",
            "Paid in Full",
            "Revised per COR",
            "Authorized by DEQ",
            "Authorized by ORWA",
            "Committee Approved",
            "Award Letter Sent",
          ].includes(app.status.data.name);
        }
      })
      .forEach((currentApplication) => {
        const amount =
          fundType === "awarded"
            ? currentApplication.award_amount || 0
            : parseInt(currentApplication.requested_grant_amount.toString()) || 0;
        totalFunds += amount
      });
  
    return Math.round(totalFunds); // Ensuring clean rounding
  };

  return (
    <Slide direction="down" in={openStatistics} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          position: "fixed",
          top: 50,
          left: 0,
          right: 0,
          zIndex: 1000,
          maxHeight: fullScreen ? "100vh" : "55vh",
          height: fullScreen ? "100vh" : "55vh",
          transition: "max-height 0.5s ease-in-out, height 0.5s ease-in-out", // Smooth transition for height changes
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Select
              size="small"
              value={chartType}
              onChange={(e) =>
                setChartType(e.target.value as "bar" | "line" | "starburst")
              }
              displayEmpty
              sx={{ width: 150 }}
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              {/* <MenuItem value="starburst">Starburst Chart</MenuItem> */}
            </Select>

            <Button
              variant={viewBy === "county" ? "contained" : "outlined"}
              onClick={() => setViewBy("county")}
              startIcon={<LocationCityIcon />}
            >
              By County
            </Button>
            <Button
              variant={viewBy === "project" ? "contained" : "outlined"}
              onClick={() => setViewBy("project")}
              startIcon={<BarChartIcon />}
            >
              By Project
            </Button>
          </Box>

          <Box>
            <Button
              variant={fundType === "awarded" ? "contained" : "outlined"}
              onClick={() => setFundType("awarded")}
              startIcon={<MonetizationOnIcon />}
              sx={{ mr: 1 }}
            >
              Awarded Funds
            </Button>
            <Button
              variant={fundType === "requested" ? "contained" : "outlined"}
              onClick={() => setFundType("requested")}
              startIcon={<AccountBalanceWalletIcon />}
            >
              Requested Funds
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: fullScreen ? "75vh" : "350px", overflowX: "auto" }}>
          {chartType === "bar" && (
            <BarChartStatistics viewBy={viewBy} fundType={fundType} />
          )}
          {chartType === "line" && <LineChartStatistics viewBy={viewBy} />}
          {chartType === "starburst" && (
            <StarburstChart
            // fundType={fundType}
            />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          Funds Summary - Total{" "}
          {fundType === "awarded" ? "Awarded" : "Requested"}: $
          {calculateTotalFunds().toLocaleString()}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -2 }}>
          <Button onClick={() => setFullScreen(!fullScreen)} color="primary">
            {fullScreen ? (
              <ArrowUpwardIcon sx={{ color: "black" }} />
            ) : (
              <ArrowDownwardIcon sx={{ color: "black" }} />
            )}
          </Button>
          <Button onClick={() => setOpenStatistics(false)} color="primary">
            <CloseIcon sx={{ color: "black" }} />
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default Statistics;
