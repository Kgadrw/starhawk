import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet with Vite/React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  center?: [number, number]; // [latitude, longitude]
  zoom?: number;
  height?: string;
  geoJsonData?: any; // GeoJSON data for field boundaries
  kmlUrl?: string; // URL to KML file to display
  boundary?: any; // Farm boundary object (GeoJSON Polygon format)
  showControls?: boolean;
  tileLayer?: "osm" | "satellite" | "terrain";
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

export default function LeafletMap({
  center = [-1.9441, 30.0619], // Default: Kigali, Rwanda
  zoom = 13,
  height = "500px",
  geoJsonData,
  kmlUrl,
  boundary,
  showControls = true,
  tileLayer = "satellite",
  onMapClick,
  className = ""
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.Layer | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Validate center coordinates
    let validCenter = center;
    const [lat, lng] = center;
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn('Invalid center coordinates, using default:', center);
      validCenter = [-1.9441, 30.0619]; // Default: Kigali, Rwanda
    }

    // Initialize map with max zoom set to 18
    const map = L.map(mapRef.current, {
      maxZoom: 18
    }).setView(validCenter, zoom);
    mapInstanceRef.current = map;

    // Tile layer options
    let tileUrl: string;
    let attribution: string;

    switch (tileLayer) {
      case "osm":
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
        break;
      case "satellite":
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = '&copy; <a href="https://www.esri.com/">ESRI</a>';
        break;
      case "terrain":
        tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
        attribution = '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>';
        break;
      default:
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = '&copy; <a href="https://www.esri.com/">ESRI</a>';
    }

    // Add tile layer
    const tileLayerInstance = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 18
    }).addTo(map);
    tileLayerRef.current = tileLayerInstance;

    // Add zoom controls if requested
    if (showControls) {
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
    }

    // Helper function to convert boundary to GeoJSON Feature
    const boundaryToGeoJSON = (boundary: any): any => {
      if (!boundary) return null;
      
      // If it's already a GeoJSON Feature or FeatureCollection, return as is
      if (boundary.type === 'Feature' || boundary.type === 'FeatureCollection') {
        return boundary;
      }
      
      // If it's a GeoJSON Polygon, wrap it in a Feature
      if (boundary.type === 'Polygon' && boundary.coordinates) {
        return {
          type: 'Feature',
          geometry: boundary,
          properties: {}
        };
      }
      
      // If it has coordinates but no type, assume Polygon
      if (boundary.coordinates && Array.isArray(boundary.coordinates)) {
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: boundary.coordinates
          },
          properties: {}
        };
      }
      
      return null;
    };

    // Determine which data to use (priority: geoJsonData > boundary > kmlUrl)
    let dataToDisplay = geoJsonData;
    if (!dataToDisplay && boundary) {
      dataToDisplay = boundaryToGeoJSON(boundary);
    }

    // Add marker at center if no data to display (boundary/GeoJSON/KML)
    if (!dataToDisplay && !kmlUrl) {
      L.marker(center).addTo(map);
    }

    // Add GeoJSON layer if provided
    if (dataToDisplay) {
      const geoJsonLayer = L.geoJSON(dataToDisplay, {
        style: {
          color: "#22c55e", // Green color for boundary lines
          weight: 4, // Thicker lines for better visibility
          fillColor: "#22c55e",
          fillOpacity: 0.2,
          dashArray: "5, 5", // Dashed line style
          lineCap: "round",
          lineJoin: "round"
        },
        onEachFeature: (feature, layer) => {
          // Add hover effect
          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 6,
                color: "#16a34a",
                fillOpacity: 0.3
              });
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 4,
                color: "#22c55e",
                fillOpacity: 0.2
              });
            }
          });
        }
      }).addTo(map);
      layerRef.current = geoJsonLayer;

      // Fit map to bounds
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    // Load KML if URL is provided
    if (kmlUrl && typeof window !== 'undefined') {
      // Dynamically load toGeoJSON library for KML parsing
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@mapbox/togeojson@0.16.0/togeojson.js';
      script.onload = () => {
        fetch(kmlUrl)
          .then(response => response.text())
          .then(kmlText => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmlText, 'text/xml');
            // @ts-ignore - toGeoJSON is loaded dynamically
            const geojson = toGeoJSON.kml(kml);
            if (geojson && mapInstanceRef.current) {
              const kmlLayer = L.geoJSON(geojson, {
                style: {
                  color: "#22c55e", // Green color for KML boundary lines
                  weight: 4, // Thicker lines for better visibility
                  fillColor: "#22c55e",
                  fillOpacity: 0.2,
                  dashArray: "5, 5", // Dashed line style
                  lineCap: "round",
                  lineJoin: "round"
                },
                onEachFeature: (feature, layer) => {
                  // Add hover effect
                  layer.on({
                    mouseover: (e) => {
                      const layer = e.target;
                      layer.setStyle({
                        weight: 6,
                        color: "#16a34a",
                        fillOpacity: 0.3
                      });
                    },
                    mouseout: (e) => {
                      const layer = e.target;
                      layer.setStyle({
                        weight: 4,
                        color: "#22c55e",
                        fillOpacity: 0.2
                      });
                    }
                  });
                }
              }).addTo(mapInstanceRef.current);
              layerRef.current = kmlLayer;
              
              const bounds = kmlLayer.getBounds();
              if (bounds.isValid()) {
                mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
              }
            }
          })
          .catch(error => {
            console.error('Failed to load KML:', error);
          });
      };
      document.head.appendChild(script);
    }

    // Handle map clicks
    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    setMapLoaded(true);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update tile layer when prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Remove old tile layer
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    // Get new tile layer URL and attribution
    let tileUrl: string;
    let attribution: string;

    switch (tileLayer) {
      case "osm":
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
        break;
      case "satellite":
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = '&copy; <a href="https://www.esri.com/">ESRI</a>';
        break;
      case "terrain":
        tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
        attribution = '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>';
        break;
      default:
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = '&copy; <a href="https://www.esri.com/">ESRI</a>';
    }

    // Add new tile layer
    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 18
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [tileLayer, mapLoaded]);

  // Helper function to convert boundary to GeoJSON
  const boundaryToGeoJSON = (boundary: any): any => {
    if (!boundary) return null;
    
    if (boundary.type === 'Feature' || boundary.type === 'FeatureCollection') {
      return boundary;
    }
    
    if (boundary.type === 'Polygon' && boundary.coordinates) {
      return {
        type: 'Feature',
        geometry: boundary,
        properties: {}
      };
    }
    
    if (boundary.coordinates && Array.isArray(boundary.coordinates)) {
      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: boundary.coordinates
        },
        properties: {}
      };
    }
    
    return null;
  };

  // Update GeoJSON/boundary layer if data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Determine which data to use
    let dataToDisplay = geoJsonData;
    if (!dataToDisplay && boundary) {
      dataToDisplay = boundaryToGeoJSON(boundary);
    }

    if (!dataToDisplay) return;

    // Remove existing GeoJSON layers (but keep base tile layer)
    if (layerRef.current) {
      mapInstanceRef.current.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    // Add new GeoJSON layer
    const geoJsonLayer = L.geoJSON(dataToDisplay, {
      style: {
        color: "#22c55e", // Green color for boundary lines
        weight: 4, // Thicker lines for better visibility
        fillColor: "#22c55e",
        fillOpacity: 0.2,
        dashArray: "5, 5", // Dashed line style
        lineCap: "round",
        lineJoin: "round"
      },
      onEachFeature: (feature, layer) => {
        // Add hover effect
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 6,
              color: "#16a34a",
              fillOpacity: 0.3
            });
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 4,
              color: "#22c55e",
              fillOpacity: 0.2
            });
          }
        });
      }
    }).addTo(mapInstanceRef.current);
    layerRef.current = geoJsonLayer;

    // Fit map to bounds
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJsonData, boundary, mapLoaded]);

  // Update center if it changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      // Validate center coordinates before setting view
      const [lat, lng] = center;
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        mapInstanceRef.current.setView(center, zoom);
      }
    }
  }, [center, zoom, mapLoaded]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <img src="/loading.gif" alt="Loading" className="w-16 h-16" />
        </div>
      )}
    </div>
  );
}

