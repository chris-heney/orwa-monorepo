import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { MapLayerMouseEvent } from "mapbox-gl";
import { Layer, Source } from "react-map-gl/mapbox";
import { T, display, money } from "../theme/tokens";
import { useAppContext } from "../providers/AppContext";
import { useMapContext } from "../providers/MapContext";
import { isApproved } from "../helpers/fiscalYear";

const FILL_LAYER_ID = "county-choropleth-fill";
const LINE_LAYER_ID = "county-choropleth-line";

/** Join key tolerant of spacing variants ("Le Flore" vs "LeFlore"). */
const countyKey = (name: string | null | undefined): string =>
  (name ?? "").toLowerCase().replace(/[^a-z]/g, "");

interface CountyStats {
  name: string;
  count: number;
  requested: number;
  awarded: number;
  disbursed: number;
}

const num = (value: unknown): number => {
  const n = parseFloat(String(value ?? 0).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};

/**
 * The signature data visualization: a county funding choropleth. Approved
 * dollars per county drive a data-joined RIG-blue heat over the state;
 * hovering spotlights a county's figures, clicking focuses the map (and the
 * financial report) on that county.
 */
const CountyChoroplethLayer = () => {
  const { reportApplications, filters, setFilters } = useAppContext();
  const { mapRef, showChoropleth } = useMapContext();
  const [counties, setCounties] = useState<FeatureCollection<
    Polygon | MultiPolygon
  > | null>(null);
  const [hovered, setHovered] = useState<CountyStats | null>(null);
  const [circleLayersReady, setCircleLayersReady] = useState(false);

  useEffect(() => {
    fetch("data/ok-counties.geojson")
      .then((response) => response.json())
      .then(setCounties)
      .catch((error) =>
        console.error("Failed to load county boundaries:", error)
      );
  }, []);

  // Aggregate the financial report per county.
  const statsByCounty = useMemo(() => {
    const stats = new Map<string, CountyStats>();
    for (const app of reportApplications) {
      const key = countyKey(app.county);
      if (!key) continue;
      const entry = stats.get(key) ?? {
        name: app.county.trim(),
        count: 0,
        requested: 0,
        awarded: 0,
        disbursed: 0,
      };
      entry.count += 1;
      entry.requested += num(app.requested_grant_amount);
      if (isApproved(app)) {
        entry.awarded += app.award_amount || 0;
        entry.disbursed += (app.payouts ?? []).reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );
      }
      stats.set(key, entry);
    }
    return stats;
  }, [reportApplications]);

  const { data, maxAwarded } = useMemo(() => {
    if (!counties) return { data: null, maxAwarded: 0 };
    let max = 0;
    const features = counties.features.map((feature) => {
      const name = String(feature.properties?.name ?? "");
      const stat = statsByCounty.get(countyKey(name));
      const awarded = stat?.awarded ?? 0;
      if (awarded > max) max = awarded;
      return {
        type: "Feature" as const,
        geometry: feature.geometry,
        properties: {
          name,
          count: stat?.count ?? 0,
          requested: stat?.requested ?? 0,
          awarded,
          disbursed: stat?.disbursed ?? 0,
        },
      };
    });
    return {
      data: { type: "FeatureCollection" as const, features },
      maxAwarded: max,
    };
  }, [counties, statsByCounty]);

  const selectedCounties: string[] = useMemo(() => {
    const filter = filters.find((f) => f.key === "county");
    return Array.isArray(filter?.value) ? (filter?.value as string[]) : [];
  }, [filters]);

  const toggleCounty = useCallback(
    (name: string) => {
      const next = selectedCounties.includes(name)
        ? selectedCounties.filter((c) => c !== name)
        : [...selectedCounties, name];
      const others = filters.filter((f) => f.key !== "county");
      setFilters(
        next.length ? [...others, { key: "county", value: next }] : others
      );
    },
    [selectedCounties, filters, setFilters]
  );

  // Hover + click interactions (mapbox events, not React props, so the
  // cursor + spotlight work with the imperative circle layers on top).
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !showChoropleth) return;

    const onMove = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature?.properties) return setHovered(null);
      map.getCanvas().style.cursor = "pointer";
      setHovered({
        name: String(feature.properties.name),
        count: Number(feature.properties.count) || 0,
        requested: Number(feature.properties.requested) || 0,
        awarded: Number(feature.properties.awarded) || 0,
        disbursed: Number(feature.properties.disbursed) || 0,
      });
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      setHovered(null);
    };
    const onClick = (e: MapLayerMouseEvent) => {
      // Application circles win over the county fill.
      const circleHits = map
        .queryRenderedFeatures(e.point)
        .filter((f) => f.source === "applications");
      if (circleHits.length) return;
      const name = e.features?.[0]?.properties?.name;
      if (name) toggleCounty(String(name));
    };

    map.on("mousemove", FILL_LAYER_ID, onMove);
    map.on("mouseleave", FILL_LAYER_ID, onLeave);
    map.on("click", FILL_LAYER_ID, onClick);
    return () => {
      map.off("mousemove", FILL_LAYER_ID, onMove);
      map.off("mouseleave", FILL_LAYER_ID, onLeave);
      map.off("click", FILL_LAYER_ID, onClick);
    };
  }, [mapRef, showChoropleth, toggleCounty]);

  // Keep the choropleth beneath the application circles: once the imperative
  // circle layers exist, remount our layers with a beforeId.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const check = () =>
      setCircleLayersReady(Boolean(map.getLayer("clusters") ?? map.getLayer("unclustered-point")));
    check();
    map.on("styledata", check);
    return () => {
      map.off("styledata", check);
    };
  }, [mapRef]);

  if (!data || !showChoropleth) return null;

  const map = mapRef.current?.getMap();
  const circleBefore =
    circleLayersReady && map
      ? map.getLayer("clusters")
        ? "clusters"
        : map.getLayer("unclustered-point")
        ? "unclustered-point"
        : undefined
      : undefined;

  const cap = Math.max(maxAwarded, 1);

  return (
    <>
      <Source id="county-choropleth" type="geojson" data={data}>
        <Layer
          id={FILL_LAYER_ID}
          type="fill"
          beforeId={circleBefore}
          paint={{
            "fill-color": T.water,
            // sqrt-ish ramp so mid-size counties still read
            "fill-opacity": [
              "interpolate",
              ["linear"],
              ["sqrt", ["/", ["get", "awarded"], cap]],
              0,
              0.02,
              0.25,
              0.16,
              0.5,
              0.32,
              0.75,
              0.48,
              1,
              0.62,
            ],
            "fill-emissive-strength": 1,
          }}
        />
        <Layer
          id={LINE_LAYER_ID}
          type="line"
          beforeId={circleBefore}
          paint={{
            "line-color": [
              "case",
              ["in", ["get", "name"], ["literal", selectedCounties]],
              T.committed,
              ["==", ["get", "name"], hovered?.name ?? ""],
              T.water,
              "rgba(142, 176, 201, 0.28)",
            ],
            "line-width": [
              "case",
              ["in", ["get", "name"], ["literal", selectedCounties]],
              2.5,
              ["==", ["get", "name"], hovered?.name ?? ""],
              2,
              0.75,
            ],
            "line-emissive-strength": 1,
          }}
        />
      </Source>

      {/* County spotlight card */}
      {hovered && (
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            right: 12,
            zIndex: 950,
            pointerEvents: "none",
            backgroundColor: `${T.panel}F2`,
            border: `1px solid ${T.line}`,
            borderRadius: "14px",
            px: 2,
            py: 1.5,
            minWidth: 220,
            boxShadow: T.hoverShadow,
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              ...display,
              fontSize: 16,
              fontWeight: 700,
              color: T.textHi,
              lineHeight: 1.2,
            }}
          >
            {hovered.name} County
          </Typography>
          <Typography sx={{ fontSize: 11, color: T.textLo, mb: 0.75 }}>
            {hovered.count.toLocaleString()} application
            {hovered.count === 1 ? "" : "s"}
          </Typography>
          {(
            [
              { label: "Requested", value: hovered.requested, color: T.water },
              { label: "Approved", value: hovered.awarded, color: T.committed },
              { label: "Disbursed", value: hovered.disbursed, color: T.inflow },
            ] as const
          ).map(
            (row) =>
              row.value > 0 && (
                <Box
                  key={row.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: row.color }}>
                    {row.label}
                  </Typography>
                  <Typography
                    sx={{
                      ...display,
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.textHi,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {money(row.value)}
                  </Typography>
                </Box>
              )
          )}
          <Typography sx={{ fontSize: 10, color: T.textFaint, mt: 0.75 }}>
            Click to {selectedCounties.includes(hovered.name) ? "unfocus" : "focus"} this county
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CountyChoroplethLayer;
