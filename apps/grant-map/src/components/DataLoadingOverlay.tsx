import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { T, display } from "../theme/tokens";
import { useAppContext } from "../providers/AppContext";

/** How long "LOADED" lingers before the overlay starts fading out. */
const LOADED_LINGER_MS = 650;
/** Fade duration — must match the CSS transition below. */
const FADE_MS = 700;

/**
 * Full-screen ink overlay shown while the session dataset streams in:
 * a live percentage + stage-gradient bar, a "LOADED" beat, then a fade.
 * Renders nothing for unauthenticated visitors (the login modal owns that).
 */
const DataLoadingOverlay = () => {
  const { loadProgress, dataLoaded } = useAppContext();
  // Skip entirely when there is no session to load data for.
  const [visible, setVisible] = useState(() => !!localStorage.getItem("jwt"));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!dataLoaded || !visible) return;
    const fadeTimer = setTimeout(() => setFading(true), LOADED_LINGER_MS);
    const unmountTimer = setTimeout(
      () => setVisible(false),
      LOADED_LINGER_MS + FADE_MS
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [dataLoaded, visible]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: T.ink,
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <Box sx={{ width: "min(420px, 82vw)", textAlign: "center" }}>
        <Typography
          sx={{
            ...display,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: T.water,
            mb: 0.5,
          }}
        >
          Rural Infrastructure Grant
        </Typography>
        <Typography
          sx={{
            ...display,
            fontSize: 30,
            fontWeight: 700,
            color: T.textHi,
            lineHeight: 1.1,
            mb: 3,
          }}
        >
          Grant Map
        </Typography>

        <Typography
          sx={{
            ...display,
            fontSize: 56,
            fontWeight: 700,
            color: dataLoaded ? T.inflow : T.textHi,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            mb: 2,
            transition: "color 0.3s ease",
          }}
        >
          {loadProgress}
          <Box component="span" sx={{ fontSize: 26, color: T.textLo, ml: 0.5 }}>
            %
          </Box>
        </Typography>

        {/* Progress bar: water -> green stage gradient with a soft glow */}
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: T.panelSoft,
            overflow: "hidden",
            mb: 2,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${loadProgress}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${T.deepWater}, ${T.water}, ${
                dataLoaded ? T.inflow : T.water
              })`,
              boxShadow: `0 0 12px ${dataLoaded ? T.inflow : T.water}66`,
              transition: "width 0.35s ease, background 0.3s ease",
            }}
          />
        </Box>

        <Typography
          sx={{
            ...display,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: dataLoaded ? "0.3em" : "0.08em",
            textTransform: dataLoaded ? "uppercase" : "none",
            color: dataLoaded ? T.inflow : T.textLo,
            transition: "color 0.3s ease, letter-spacing 0.3s ease",
          }}
        >
          {dataLoaded ? "Loaded" : "Streaming grant data\u2026"}
        </Typography>
      </Box>
    </Box>
  );
};

export default DataLoadingOverlay;
