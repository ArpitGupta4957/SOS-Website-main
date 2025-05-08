import React, { useState, useCallback } from "react";
import { GoogleMap, LoadScript,Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 28.7041, // Default: Delhi
  lng: 77.1025,
};

const Maps = () => {
  const [marker, setMarker] = useState(center);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(""); // Store errors

  // Handle map click to get address
  const handleMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng }); // Update marker position

    try {
      const response = await axios.post(
        "http://localhost:5000/getGeoLocation",
        {
          longitude: lng,
          latitude: lat,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.msg.results.length > 0) {
        setAddress(response.data.msg.results[0].formatted_address);
      } else {
        setAddress("No address found");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      setAddress("Error fetching address");
    }
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAKh-gY2tdwjmGO6XnUsqyDR-h8_ICk4tU"
      onError={(e) => {
        console.error("Google Maps API Error:", e);
        setError("Google Maps failed to load. Check your API key.");
      }}
    >
      {error ? (
        <div style={{ color: "red", padding: "20px" }}>{error}</div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={marker}
          zoom={10}
          onClick={handleMapClick}
        >
          {/* Use AdvancedMarker instead of Marker */}
          <Marker position={marker} />
        </GoogleMap>
      )}
      <div
        style={{
          padding: "10px",
          background: "#fff",
          position: "absolute",
          bottom: 20,
          left: 20,
        }}
      >
        <strong>Address:</strong> {address}
      </div>
    </LoadScript>
  );
};

export default Maps;
