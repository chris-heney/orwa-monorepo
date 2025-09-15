import React from "react";
import {
  useListContext,
  useRedirect,
} from "react-admin";
import {
  Grid,
  Card,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const CorporateSponsorsGrid = () => {
  const { data, isLoading } = useListContext();
  const redirect = useRedirect();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const handleSponsorClick = (id: string | number) => {
    redirect("edit", "corporate-sponsors", id);
  };

  return (
    <Card sx={{ 
      boxShadow: 1,
      borderRadius: 2,
      overflow: "hidden"
    }}>     
    <Grid container spacing={2} sx={{ pb: 4, p: 1 }}>
      {data.map((sponsor) => (
        <Grid key={sponsor.id} xs={12} sm={6} md={4} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Card
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": { boxShadow: 6, cursor: "pointer" },
                position: "relative",
                mb: 2,
                borderRadius: 2,
                overflow: "hidden"
              }}
              onClick={() => handleSponsorClick(sponsor.id)}
            >
              {/* Status Tag in Top Right */}
              <Chip
                label={sponsor.active ? "Active" : "Inactive"}
                size="small"
                color={sponsor.active ? "success" : "error"}
                variant="filled"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  fontWeight: "bold",
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
                }}
              >
                {sponsor.logo && sponsor.logo?.small?.url ? (
                  <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}${
                      sponsor.logo.url
                    }`}
                    alt={sponsor.name || "Sponsor logo"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Logo
                  </Typography>
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
                fontSize: "1rem"
              }}
            >
              {sponsor.name}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
    </Card>
  );
};

export default CorporateSponsorsGrid;
