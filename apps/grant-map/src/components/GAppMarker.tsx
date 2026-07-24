import { useRef, useEffect } from "react";
import { formatNumberCompact } from "../helpers/formators";
import mapboxgl from "mapbox-gl";
import { useMapContext } from "../providers/MapContext";
import IGrantApplication from "../types/IGrantApplication";
import { getOverlappingMarkers } from "../helpers/getOverlappingMarkers";
import { useAppContext } from "../providers/AppContext";
import { stageColorForApplication } from "../helpers/stages";

interface GAppMarkerProps {
  position: {
    lat: number;
    lng: number;
  };
  currentApplication: IGrantApplication;
}

const GAppMarker = ({ position, currentApplication}: GAppMarkerProps) => {
  const {
    mapRef,
    setNewLocation,
    setIsInfoWindowOpen,
    newLocation,
    setCurrentApplication,
    setIsApplicationSelectModalOpen,
    setOverlappingApplications,
  } = useMapContext();
  const { applications } = useAppContext();

  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef || !position || !currentApplication) return;

    // Create custom marker element
    const markerElement = document.createElement("div");
    markerElement.style.display = "flex";
    markerElement.style.flexDirection = "column";
    markerElement.style.alignItems = "center";
    markerElement.style.cursor = "pointer"; // Ensures the cursor changes to a pointer for the whole marker

    const stageColor = stageColorForApplication(currentApplication);

    // Create price tag (ink-ledger style: dark panel, stage-colored accent)
    const priceTag = document.createElement("div");
    priceTag.style.borderRadius = "8px";
    priceTag.style.border = `1.5px solid ${stageColor}`;
    priceTag.style.fontSize = "12px";
    priceTag.style.fontWeight = "700";
    priceTag.style.fontFamily =
      "'Barlow Semi Condensed', 'Roboto Condensed', sans-serif";
    priceTag.style.padding = "4px 9px";
    priceTag.style.backgroundColor = "rgba(21, 31, 41, 0.92)";
    priceTag.style.color = "#EAF3FA";
    priceTag.style.boxShadow = "0 2px 8px rgba(0,0,0,0.45)";
    priceTag.style.userSelect = "none";
    priceTag.textContent = `$${formatNumberCompact(
      currentApplication.award_amount
    )}`;
    markerElement.appendChild(priceTag);

    // Create price tag arrow
    const arrow = document.createElement("div");
    arrow.style.position = "relative";
    arrow.style.top = "0px";
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.borderLeft = "8px solid transparent";
    arrow.style.borderRight = "8px solid transparent";
    arrow.style.borderTop = `8px solid ${stageColor}`;
    markerElement.appendChild(arrow);

    // Initialize marker
    markerRef.current = new mapboxgl.Marker({
      element: markerElement,
    })
      .setLngLat([position.lng, position.lat])
      .addTo(mapRef.current?.getMap() as mapboxgl.Map);

    // Add click event listener to the whole marker element
    markerElement.addEventListener("click", () => {
      setOverlappingApplications(
        getOverlappingMarkers(applications, currentApplication)
      );

      if (getOverlappingMarkers(applications, currentApplication).length > 1) {
        setIsApplicationSelectModalOpen(true);
        setCurrentApplication(null)
      } else {
        setIsApplicationSelectModalOpen(false);
        setCurrentApplication(currentApplication);
      }
    });

    // const onDragEnd = () => {
    //   if (markerRef.current) {
    //     const lngLat = markerRef.current.getLngLat();
    //     setNewLocation({
    //       lat: lngLat.lat,
    //       lng: lngLat.lng,
    //       id: currentApplication.id,
    //     });
    //     setIsInfoWindowOpen(true);
    //     setCurrentApplication(currentApplication);
    //   }
    // };

    // if (markerRef.current) {
    //   markerRef.current.on("dragend", onDragEnd);
    // }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [
    mapRef,
    position,
    setNewLocation,
    setIsInfoWindowOpen,
    currentApplication,
  ]);

  useEffect(() => {
    if (!newLocation || !currentApplication) return;
    if (markerRef.current && newLocation?.id === currentApplication.id) {
      markerRef.current.setLngLat([newLocation.lng, newLocation.lat]);
    }
  }, [newLocation, currentApplication.id]);

  return null;
};

export default GAppMarker;
