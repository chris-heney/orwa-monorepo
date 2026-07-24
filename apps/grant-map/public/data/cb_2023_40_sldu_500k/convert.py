import geojson
from pykml import parser
import xmltodict

def parse_metadata(xml_file_path):
    with open(xml_file_path, 'r') as file:
        metadata = xmltodict.parse(file.read())
    return metadata

def kml_to_geojson(kml_file_path, geojson_file_path, metadata_file_path):
    # Parse the KML file
    with open(kml_file_path, 'r') as kml_file:
        root = parser.parse(kml_file).getroot()
    
    # Parse the metadata XML file
    metadata = parse_metadata(metadata_file_path)
    
    # Create a GeoJSON structure
    geojson_features = []

    # Iterate over the Placemark elements in the KML
    for placemark in root.Document.Folder.Placemark:
        # Extract the coordinates
        coords = placemark.Polygon.outerBoundaryIs.LinearRing.coordinates.text.strip()
        coords_list = coords.split()

        # Convert coordinates to GeoJSON format
        geojson_coords = []
        for coord in coords_list:
            lon, lat, _ = map(float, coord.split(','))
            geojson_coords.append((lon, lat))

        # Create a GeoJSON feature with metadata
        feature = geojson.Feature(
            geometry=geojson.Polygon([geojson_coords]),
            properties=metadata  # Including metadata in properties
        )
        geojson_features.append(feature)

    # Create a GeoJSON FeatureCollection
    feature_collection = geojson.FeatureCollection(geojson_features)

    # Write the GeoJSON to a file
    with open(geojson_file_path, 'w') as geojson_file:
        geojson.dump(feature_collection, geojson_file, indent=2)

# Define the input KML file, metadata XML file, and output GeoJSON file paths
kml_file_path = 'cb_2023_40_sldu_500k.kml'
metadata_file_path = 'cb_2023_40_sldu_500k.kml.ea.iso.xml'
geojson_file_path = 'output.geojson'

# Convert the KML to GeoJSON
kml_to_geojson(kml_file_path, geojson_file_path, metadata_file_path)

