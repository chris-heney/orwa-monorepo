// Utility function to check for overlapping points within a small distance (tolerance).
type point = {
    lat: number;
    lng: number;
}

export const arePointsClose = (point1: point, point2: point, tolerance = 0.0000001) => {
    return (
      Math.abs(point1.lat - point2.lat) < tolerance &&
      Math.abs(point1.lng - point2.lng) < tolerance
    );
  };
  