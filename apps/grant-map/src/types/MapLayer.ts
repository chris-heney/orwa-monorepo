import SpatialMeta from "./SpatialMeta"
import { SpatialRegion } from "./SpatialRegion"

type MapLayerName = string

export interface MapLayer {
    title: MapLayerName
    file: string
    description?: string
    meta?: SpatialMeta[]    // Meta data about the entire map layer; each region also has an array of meta
    regions: SpatialRegion[]
}