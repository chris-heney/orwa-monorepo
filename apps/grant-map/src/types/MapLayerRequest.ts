type MapLayerName = string

interface KmlRequestBase {
    title: MapLayerName
    metaQuery?: Record<string, string>
}

// Require `name`, make `url` optional
interface NameRequired extends KmlRequestBase {
    file: string
    url?: never
}

// Require `url`, make `file` optional
interface NameQueryRequired extends KmlRequestBase {
    file?: never
    url: string
}

// Create a union type that requires one or the other
type MapLayerRequest = NameRequired | NameQueryRequired
