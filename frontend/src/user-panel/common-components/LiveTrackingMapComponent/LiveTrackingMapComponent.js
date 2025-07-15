import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './LiveTrackingMapComponent.scss'

const containerStyle = {
  width: '100%',
  minHeight: '400px',
  height: '100%',
};

// Default center (London)
const defaultCenter = { lat: 51.509865, lng: -0.118092 };

const GOOGLEMAP_APIKEY = process.env.REACT_APP_GOOGLEMAP_APIKEY;

const LiveTrackingMapComponent = ({ restaurantLocation, driverLocation, customerLocation }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [driverRoute, setDriverRoute] = useState(null);
  useEffect(() => {
    // Center the map based on the restaurant's location by default
    if (restaurantLocation) {
      setCenter(restaurantLocation);
    }
  }, [restaurantLocation]);

  useEffect(() => {
    if (driverLocation && customerLocation && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      // Request the directions from the restaurant to the customer
      const request = {
        origin: driverLocation, // Start location (Restaurant)
        destination: customerLocation, // End location (Customer)
        travelMode: window.google.maps.TravelMode.DRIVING, // Mode of transportation (driving)
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const route = result.routes[0].overview_path;
          setDriverRoute(route); // Set the route for polyline
        } else {
          console.error("Directions request failed due to: " + status);
        }
      });
    }
  }, [driverLocation, customerLocation]);

  return (
    <div className='live-tracking'>
      {!restaurantLocation ? (
        <div className='d-flex w-100 h-100 justify-content-center align-items-center ' style={{ color: 'red', fontSize: "12px" }}>
          <i className='ri-map-pin-line me-1'></i>
          Locations could not be found.
        </div>
      ) :
        <LoadScript googleMapsApiKey={GOOGLEMAP_APIKEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            {restaurantLocation && (
              <Marker
                position={restaurantLocation}
                icon={{
                  url: '/images/svg/placed.svg',
                  scaledSize: { width: 40, height: 40 },
                }}
              />
            )}
            {driverLocation && (
              <div>
                <Marker
                position={driverLocation}
                icon={'/images/svg/driver.svg'}
                className="driver-marker"
                animation="DROP"
              />
              </div>
              
            )}
            {customerLocation && (
              <Marker
                position={customerLocation}
                icon={{
                  url: '/images/svg/user-map.svg',
                  scaledSize: { width: 40, height: 40 },
                }}
                options={{
                  width: 40
                }}
              />
            )}
            {/* Polyline for Driver Route */}
            {driverRoute && (
              <Polyline
                path={driverRoute}
                geodesic={false}
                options={{
                  strokeColor: '#0062ff',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      }
    </div>
  );
};

export default LiveTrackingMapComponent;
