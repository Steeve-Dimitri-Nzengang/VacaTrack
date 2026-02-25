interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  locations: MapLocation[];
}

const MapView: React.FC<MapViewProps> = ({ locations }) => {
  // Einfache Kartenansicht – Leaflet wird in Phase 2 integriert
  return (
    <div className="card">
      <h3>🗺️ Kartenansicht</h3>
      {locations.length === 0 ? (
        <p>Keine Orte verfügbar.</p>
      ) : (
        <ul>
          {locations.map(loc => (
            <li key={loc.id}>📍 {loc.name} ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapView;