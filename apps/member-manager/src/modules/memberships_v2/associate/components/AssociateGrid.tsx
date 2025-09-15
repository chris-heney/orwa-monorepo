import React, { useState, useEffect } from "react";
import { useListContext, useRedirect, useDataProvider } from "react-admin";
import { Grid, Card, Typography, Box, Chip, Avatar } from "@mui/material";
import getExpirationDate from "../../../_helpers/getExpirationDate";
import getExpiryBackground from "../../../_helpers/getExpiryBackground";
import getContrastColor from "../../../_helpers/getContrastColor";
import uploadService from "../../../../services/uploadService/uploadService";

// Membership level color mapping based on the image provided
const getMembershipLevelColor = (level: string) => {
  if (!level) return "#BDBDBD";
  switch (true) {
    case level.includes("Basic"):
      return "#9E9E9E"; // Gray
    case level.includes("Bronze"):
      return "#CD7F32"; // Bronze
    case level.includes("Silver"):
      return "#C0C0C0"; // Silver
    case level.includes("Gold"):
      return "#FFD700"; // Gold
    case level.includes("Platinum"):
      return "#E5E4E2"; // Platinum
    default:
      return "#BDBDBD"; // Default gray for "None" or undefined
  }
};

// Separate component for individual associate items
const AssociateGridItem = ({ associate }: { associate: any }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [membershipLevel, setMembershipLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  useEffect(() => {
    const loadLogo = async () => {
      try {
        if (Array.isArray(associate?.logo) && associate?.logo[0]) {
          const logoData = await uploadService.getFile(associate.logo[0]);
          if (logoData?.url) {
            setLogoUrl(`${import.meta.env.VITE_API_ENDPOINT}${logoData.url}`);
          }
        }
        if (typeof associate?.membership === "number") {
          const { data: membership} = await dataProvider.getOne("memberships", {
            id: associate.membership,
          });
          console.log("membership", membership.name);
          setMembershipLevel(membership.name);
        } else if (typeof associate?.member_level === "string") {
          setMembershipLevel(associate.member_level);
        } else {
          setMembershipLevel("None");
        }
      } catch (error) {
        console.error("Error loading logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, [associate?.logo]);

  const handleAssociateClick = () => {
    redirect("edit", "associates", associate.id);
  };

  const expirationDate = getExpirationDate(
    associate.payment_previous_date,
    associate.payment_last_date
  );
  const displayDate = expirationDate.isValid()
    ? expirationDate.format("MM/DD/YY")
    : "N/A";

  return (
    <Grid item key={associate.id} xs={12} sm={6} md={4} lg={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            "&:hover": { boxShadow: 6, cursor: "pointer" },
            position: "relative",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
          onClick={handleAssociateClick}
        >
          {/* Membership Level Tag in Top Right */}
          <Chip
            label={membershipLevel || "None"}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              fontWeight: "bold",
              backgroundColor: getMembershipLevelColor(membershipLevel || ""),
              color: getContrastColor(
                getMembershipLevelColor(membershipLevel || "")
              ),
            }}
          />

          {/* Image Container */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isLoading ? "#f5f5f5" : "transparent",
            }}
          >
            {isLoading ? (
              <Avatar sx={{ width: "50%", height: "50%" }} />
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt={associate.name || "Associate logo"}
                style={{
                  width: "100%",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  // Fallback to avatar if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"><div style="width: 50%; height: 50%; background-color: #bdbdbd; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 2rem;">?</div></div>';
                }}
              />
            ) : (
              <Avatar sx={{ width: "50%", height: "50%" }} />
            )}
          </Box>
        </Card>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          noWrap
          align="center"
          sx={{
            fontWeight: "bold",
            maxWidth: "100%",
            fontSize: "1rem",
            mb: 1,
          }}
        >
          {associate.name}
        </Typography>

        {/* Expiration Date Chip */}
        <Chip
          label={`Expires: ${displayDate}`}
          size="small"
          variant="outlined"
          sx={{
            fontSize: "0.75rem",
            fontWeight: "medium",
            color: getContrastColor(
              getExpiryBackground(displayDate) as `#${string}`
            ),
            borderColor: displayDate === "N/A" ? "#f44336" : "#ccc",
            backgroundColor: getExpiryBackground(displayDate),
          }}
        />
      </Box>
    </Grid>
  );
};

const AssociateGrid = () => {
  const { data, isLoading } = useListContext();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Grid container columnSpacing={2} rowSpacing={1} sx={{ pb: 4, p: 1 }}>
        {data.map((associate) => (
          <AssociateGridItem key={associate.id} associate={associate} />
        ))}
      </Grid>
    </Card>
  );
};

export default AssociateGrid;
