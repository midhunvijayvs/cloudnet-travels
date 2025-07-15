import React, { useState, useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

const UserLocationTracker = ({ driverId }) => {
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL;
  const socketUrl = `${WEBSOCKET_BASE_URL}/location/${driverId}/`;
  const [location, setLocation] = useState({ lat: null, lng: null });
  const previousLocationRef = useRef(null); // Store the previous location

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true, // Reconnect on disconnect
  });

  // Get live location from the browser
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => console.error('Error getting location:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Send location to the WebSocket whenever it changes
  useEffect(() => {
    const hasLocationChanged = () => {
      const prevLocation = previousLocationRef.current;
      if (!prevLocation) return true; // If no previous location, send it
      const { lat: prevLat, lng: prevLng } = prevLocation;
      const { lat, lng } = location;
      return prevLat !== lat || prevLng !== lng; // Check if lat/lng differ
    };

    if (location.lat !== null && location.lng !== null && hasLocationChanged()) {
      const message = JSON.stringify(location);
      console.log('sending..location:', location);
      
      sendMessage(message);
      previousLocationRef.current = location; // Update previous location
    }
  }, [location, sendMessage]);

  return <div></div>;
};

export default UserLocationTracker;
