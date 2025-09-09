import IGrantApplication from "../types/IGrantApplication";
import { arePointsClose } from "./arePointsClose";

export const getOverlappingMarkers = (
    applications: IGrantApplication[],
    clickedApp: IGrantApplication
  ) => {
    return applications.filter((app) => {
      if (!app.location || !clickedApp.location) return false;
       return arePointsClose(app.location, clickedApp.location) 
  });
  };