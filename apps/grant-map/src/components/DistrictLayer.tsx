
import '../lib/GeoJsonLayer'
import { useGeoJSON } from '../lib/GeoJsonLayer'


/**
 * Controller for the district layer
 */
const DistrictLayer = () => {

  const { data, loading } = useGeoJSON('data/ok-districts.geojson')
  console.log(data)

  return loading 
  ? <>Districts Loading</>
  : <>Districts Loaded</>

}

export default DistrictLayer