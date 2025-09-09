import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import SpatialMeta from './SpatialMeta'

export interface SpatialRegion {
    name: string
    description: string
    meta?: SpatialMeta[]
    polygon:  Feature<Polygon, GeoJsonProperties>;
}