import React, { createContext, useContext, useState, useRef, PropsWithChildren } from "react";
import { MapRef } from "react-map-gl/mapbox";
import IGrantApplication from "../types/IGrantApplication";

interface MapContextProps {
  mapRef: React.MutableRefObject<MapRef | null>;
  newLocation: { lat: number; lng: number; id: number } | null;
  setNewLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; id: number } | null>
  >;
  isInfoWindowOpen: boolean;
  setIsInfoWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentApplication: IGrantApplication | null;
  setCurrentApplication: React.Dispatch<
    React.SetStateAction<IGrantApplication | null>
  >;
  isClusteredView: boolean;
  toggleClusteredView: () => void;
  mapStyle: string; 
  setMapStyle: React.Dispatch<React.SetStateAction<string>>;
  isApplicationSelectModalOpen: boolean;
  setIsApplicationSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overlappingApplications: IGrantApplication[];
  setOverlappingApplications: React.Dispatch<React.SetStateAction<IGrantApplication[]>>;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return context;
};

const MapContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const mapRef = useRef<MapRef>(null);
  const [newLocation, setNewLocation] = useState<{ lat: number; lng: number; id: number } | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
  const [currentApplication, setCurrentApplication] = useState<IGrantApplication | null>(null);
  const [isClusteredView, setIsClusteredView] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/streets-v9'); // Default to street view
  const [isApplicationSelectModalOpen, setIsApplicationSelectModalOpen] = useState<boolean>(false);
  const [overlappingApplications, setOverlappingApplications] = useState<IGrantApplication[]>([]);


  const toggleClusteredView = () => {
    setIsClusteredView((prev) => !prev);
  };

  return (
    <MapContext.Provider
      value={{
        mapRef,
        newLocation,
        setNewLocation,
        isInfoWindowOpen,
        setIsInfoWindowOpen,
        currentApplication,
        setCurrentApplication,
        isClusteredView,
        toggleClusteredView,
        mapStyle,
        setMapStyle,
        isApplicationSelectModalOpen,
        setIsApplicationSelectModalOpen,
        overlappingApplications,
        setOverlappingApplications,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContextProvider;