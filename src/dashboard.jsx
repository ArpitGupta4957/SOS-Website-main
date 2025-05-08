import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient"; // Import Supabase client
import "./dashboard.css";
import axios from "axios";
import Maps from "./Maps";
import { url } from "./App";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [stationId, setStationId] = useState();
  const [userEmail, setUserEmail] = useState(""); // Store user email prefix
  const [stationType, setStationType] = useState("Loading..."); // Store station_type
  const navigate = useNavigate();

  // Default manual images (only used if no images are in the database)
  const getLongLatData = async (long, lat) => {
    console.log(long, lat);
    try {
      const response = await axios.post(
        `${url}/getGeoLocation`,
        {
          longitude: long,
          latitude: lat,
        },
        {
          withCredentials: true,
        }
      );
      return response.data.msg; // Logs API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const listenForSOSUpdates = (userEmail) => {
    const subscription = supabase
      .channel("sos_requests_updates") // Channel name
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sos_requests" }, // Listen for INSERT, UPDATE, DELETE
        async (payload) => {
          const eventType = payload.eventType; // INSERT, UPDATE, DELETE
          console.log(eventType);
          if (eventType === "UPDATE") {
            const updatedFields = payload.new;
            const oldFields = payload.old;

            // ✅ Only trigger if `radius`, `ids_rejected`, or `assigned` changed
            if (
              updatedFields.radius !== oldFields.radius ||
              updatedFields.ids_rejected !== oldFields.ids_rejected ||
              updatedFields.assigned_handler_id !==
              oldFields.assigned_handler_id
            ) {
              console.log("SOS request updated:", updatedFields);

              await fetchImages(userEmail);
            }
          } else {
            // ✅ Handle INSERT and DELETE normally
            console.log(
              `SOS request ${eventType.toLowerCase()} detected:`,
              payload
            );
            await fetchImages(userEmail);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup on unmount
    };
  };
  const fetchImages = async (userEmail) => {
    const response = await axios.post(`${url}/get-requests`, {
      email: userEmail,
    });

    console.log(response);
    if (response.status !== 200) {
      console.error("Error fetching images:", error.message);
    } else {
      const imagesInfoArr = response.data;

      for (const imageInfo of imagesInfoArr) {
        const data = await getLongLatData(imageInfo.longitude, imageInfo.latitude);
        if (data) {
          imageInfo.address = data.plus_code.compound_code
        }
        imageInfo.sender_name = imageInfo.sender_name || "Unknown Sender";
        imageInfo.phone_no = imageInfo.phone_no || "Not Provided";

        console.log(images)
        // console.log(data);
      }
      setImages(imagesInfoArr)
    }

  };
  useEffect(() => {
    const fetchUserDetails = async (user, stationInfo) => {
      if (!user) return;
      const emailPrefix = user?.email; // Extract part before '@'
      setUserEmail(emailPrefix);
      setStationId(stationInfo.id);
      // Fetch station_type based on email from request_handlers table

      setStationType(stationInfo.station_type.toUpperCase() || "Unknown"); // Show fetched station_type
    };

    const getUserSession = async () => {
      console.log(localStorage.getItem("access_token"))
      const response = await axios.get(`${url}/fetch-user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        } // 🔥 This ensures cookies are sent with requests
      });
      console.log(response.data);
      if (response.status === 200) {
        await fetchUserDetails(response.data?.user, response.data?.stationInfo);
      } else {
        localStorage.removeItem("access_token");
        navigate("/login"); // Redirect if not logged in
      }
    };
    getUserSession();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchImages(userEmail);
      listenForSOSUpdates(userEmail);
    }
  }, [userEmail]);
  const handleAccept = async (imageId, email) => {
    try {
      const response = await axios.post(
        `${url}/accept-request`,
        {
          email,
          requestId: imageId,
        }
      );
      if (response?.status == 200) {
        console.log("successfull");
      }
    } catch { }
  };

  const handleReject = async (imageId, email) => {
    try {
      const response = await axios.post(
        `${url}/reject-request`,
        {
          email,
          requestId: imageId,
        }
      );
      if (response?.status == 200) {
        console.log("successfull");
      }
    } catch { }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token")
      supabase.auth.signOut()
      navigate("/login"); // Redirect to login page
    } catch (e) {
      console.log("error occured", e);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <button className="sos-button">SOS</button>
        <h2>{stationType}</h2> {/* Show the exact station_type from DB */}
        <div className="user-container">
          <span className="username">{userEmail || "User"}</span>{" "}
          {/* Show email prefix */}
          <div className="logout-container">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Dynamic Image Display Container */}

      <div className="image-container">
        {images.length > 0 ? (
          <div className="scrollable-container">

            {images.map((image) => (
              <div key={image.id} className="image-box">
                <div className="sender-details">
                  <div><strong>Sender:</strong> {image.sender_name || "N/A"}</div>
                  <div><strong>Phone:</strong> {image.phone_no || "N/A"}</div>
                </div>
                <img
                  src={image.photo_url}
                  alt="Incident"
                  className="alert-image"
                />
                <div className="address">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(image.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {image.address}
                  </a>
                </div>
                <div style={{ fontWeight: 'bold' }} >Intensity of Fire:{image.image_classification}</div>
                <div className="action-buttons">
                  {image.assigned_handler_id &&
                    image.assigned_handler_id == stationId ? (
                    <Fragment>
                      <button className="accept">Accepted</button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <button
                        className="accept"
                        onClick={() => handleAccept(image.id, userEmail)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleReject(image.id, userEmail)}
                      >
                        Reject
                      </button>
                    </Fragment>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-image-box">No Emergency Post</div>
        )}
      </div>
      {/* <Maps/> */}

    </div>
  );
};

export default Dashboard;

