import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import './MapLocationSelector.scss'
import API from '../../../API'

const containerStyle = {
  width: '100%',
  minHeight: '300px',
  height: '100%',
};

const libraries = ['places'];
const GOOGLEMAP_APIKEY = process.env.REACT_APP_GOOGLEMAP_APIKEY;

const MapLocationSelector = ({ center, onSelect }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(center);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState('Fetching current location...');

  useEffect(() => {
    setSelectedPosition(center);
    setUserLocation(center);
  }, [center]);

  // current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Use Google Maps Geocoding API to get address from lat/lng
          let apiUrl = `/communication/get-address/?lat=${lat}&lng=${lng}`;
          API.get(apiUrl)
            .then(response => {
              const address = response.data.results[0]?.formatted_address || 'Current location';
              // Update the displayed address
              setCurrentLocationAddress(address);
              setCurrentLocation({
                name: 'Current Location',
                address: address,
                lat,
                lng,
              });
            })
            .catch(error => {
              console.error('Error fetching address', error);
              setCurrentLocationAddress('Current location');
            });
        },
        (error) => {
          console.error('Error fetching location', error);
          setCurrentLocationAddress('Unable to fetch location');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setCurrentLocationAddress('Geolocation not supported');
    }
  };
  useEffect(() => {
    fetchCurrentLocation();
  }, []);


  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    onSelect({ lat, lng });
  };

  const handleSearchSelect = (place) => {
    if (!place) {
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setSelectedPosition({ lat, lng });
    setUserLocation({ lat, lng });
    onSelect({ lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation && currentLocation.lat && currentLocation.lng) {
      const lat = currentLocation.lat;
      const lng = currentLocation.lng;
      setSelectedPosition({ lat, lng });
      setUserLocation({ lat, lng });
      onSelect({ lat, lng });
    }
  };





  return (
    <div className='location-select-container'>
      <LoadScript googleMapsApiKey={GOOGLEMAP_APIKEY} libraries={libraries}>
        <Autocomplete
          onLoad={(autocomplete) => {
            window.autocomplete = autocomplete;
          }}
          onPlaceChanged={() => {
            const place = window.autocomplete.getPlace();
            handleSearchSelect(place);
          }}
        >
          <input
            type="search"
            placeholder="Search for a location"
            style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
          />
        </Autocomplete>
        {/* <div className='d-flex mb-2 current-location'>
          <i className="ri-focus-3-line focus"></i>
          <button className='current-btn ms-1' onClick={handleUseCurrentLocation}>Use Current Location</button>
        </div> */}
        <div>
          <a className={`current-location ${currentLocation ? '': 'disabled'}`} onClick={handleUseCurrentLocation} >
            <div className="current-address">
              <i className="ri-focus-3-line focus"></i>
              <div>
                <h5>Use current-location</h5>
                <h6>{currentLocationAddress}</h6>
              </div>
            </div>
            {/* <i className="ri-arrow-right-s-line arrow"></i> */}
          </a>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={12}
          onClick={handleMapClick}
        >
          {selectedPosition && (selectedPosition.lat !== 51.509865 || selectedPosition.lng !== -0.118092) && (
            <Marker
              position={selectedPosition}
            // icon={'/images/svg/user-map.svg'}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapLocationSelector;
