/**
 * Spatial meta is meta data specific to the spatial region AND a spatial layer.
 */

export default interface SpatialMeta {
    key: string
    label: string
    value: string
    color?: string
}
