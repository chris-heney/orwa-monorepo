import { useMap } from '@uidotdev/usehooks'
import { Feature, FeatureCollection, Polygon } from 'geojson'
import { useState } from 'react'


// export default DistrictLayer
interface IMapLayerData {
  loading: boolean
  data: google.maps.Polygon[]
}

export const useGeoJSON = ( filename: string): IMapLayerData => {
  
  const map = useMap()
  const data: google.maps.Polygon[] = []

  const [loading, setLoading] = useState<boolean>(true)
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection[]>([]) 

  fetch(filename).then(
    response => response.json().then(gjd => {
      setGeoJsonData(gjd)
      setLoading(false)
    })
  )
 
  if ( ! loading ) {
    (geoJsonData as unknown as FeatureCollection).features.forEach( ( feature: Feature ) => {

      const paths = (feature.geometry as Polygon).coordinates.map( (coord) => ({
        lat: coord[1],
        lng: coord[0]
      }) )

      data.push(new google.maps.Polygon({
        paths,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      }))

      data[data.length - 1].setMap(map as unknown as google.maps.Map)

    })
  }

  return {
    loading: true,
    data,
  }
}