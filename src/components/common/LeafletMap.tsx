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
  showControls = true,
  tileLayer = "satellite",
  onMapClick,
  className = ""
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
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
    L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19
    }).addTo(map);

    // Add zoom controls if requested
    if (showControls) {
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
    }

    // Add marker at center if no GeoJSON
    if (!geoJsonData) {
      L.marker(center).addTo(map);
    }

    // Add GeoJSON layer if provided
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: "#10b981",
          weight: 3,
          fillColor: "#22c55e",
          fillOpacity: 0.3
        }
      }).addTo(map);

      // Fit map to bounds
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
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

  // Update GeoJSON layer if data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonData || !mapLoaded) return;

    // Remove existing GeoJSON layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add new GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: {
        color: "#10b981",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: 0.3
      }
    }).addTo(mapInstanceRef.current);

    // Fit map to bounds
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJsonData, mapLoaded]);

  // Update center if it changes
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom, mapLoaded]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

