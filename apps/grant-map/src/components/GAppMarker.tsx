import { useRef, useEffect } from "react";
import { formatNumberCompact } from "../helpers/formators";
import mapboxgl from "mapbox-gl";
import { useMapContext } from "../providers/MapContext";
import IGrantApplication from "../types/IGrantApplication";
import { getOverlappingMarkers } from "../helpers/getOverlappingMarkers";
import { useAppContext } from "../providers/AppContext";

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

    // Create price tag
    const priceTag = document.createElement("div");
    priceTag.style.borderRadius = "8px";
    priceTag.style.border = "1px solid #000000";
    priceTag.style.fontSize = "12px";
    priceTag.style.padding = "5px 10px";
    priceTag.style.backgroundColor =
      currentApplication.status.data.color;
    priceTag.style.color =
      currentApplication.status.data.color === "#FFFFFF"
        ? "black"
        : "white";
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
    arrow.style.borderTop = `8px solid ${currentApplication.status.data.color}`;
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
