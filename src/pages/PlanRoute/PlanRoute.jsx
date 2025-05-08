  import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Custom placeholder icon
// Truck 3D-style icon
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png', // Example truck icon
  iconSize: [45, 45],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40],
});

// Depot 3D-style icon
const depotIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png', // Example warehouse icon
  iconSize: [45, 45],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40],
});

// Component to handle routing
const RoutingMachine = ({ waypoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Add new routing control
    routingControlRef.current = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
      routeWhileDragging: true,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      if (map && routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, waypoints]);

  return null;
};



const Driver = () => {
  const [waypoints, setWaypoints] = useState([
    { lat: 51.505, lng: -0.09 },
    { lat: 51.51, lng: -0.1 },
  ]);

  const handleMarkerDrag = (index, event) => {
    const newWaypoints = [...waypoints];
    const { lat, lng } = event.target.getLatLng();
    newWaypoints[index] = { lat, lng };
    setWaypoints(newWaypoints);
  };

  return (
    <div className="container-fluid" style={{ position: "relative", height: "80vh", display: "flex", flexDirection: "column" }}>
      <h1 className="text-center my-4">Driver Management</h1>
      <p className="text-muted text-center mb-4">
        This page is for managing driver profiles, ratings, reviews, and service logs.
      </p>
      <div className="flex-grow-1 position-relative border rounded shadow">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {waypoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.lat, point.lng]}
              icon={index === 0 ? truckIcon : depotIcon}
              draggable={true}
              eventHandlers={{
                dragend: (event) => handleMarkerDrag(index, event),
              }}
            >
              <Popup>
                {index === 0 ? "Truck (Start Point)" : "Depot (End Point)"}
              </Popup>
            </Marker>
          ))}

          <RoutingMachine waypoints={waypoints} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Driver;
