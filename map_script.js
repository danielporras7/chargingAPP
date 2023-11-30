function initMap() {
  const defaultLocation = { lat: -34.397, lng: 150.644 };

  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 15,
  });

  // Try to use browser's geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation);
        createUserMarker(userLocation);
        searchNearby(userLocation);
      },
      () => handleLocationError(true, map.getCenter())
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function createUserMarker(location) {
  new google.maps.Marker({
    position: location,
    map: map,
    title: "Your Location",
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  });
}

async function searchNearby(center) {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = "API_KEY_HERE"; // Use your actual API key here

  const requestBody = {
    includedTypes: ["electric_vehicle_charging_station"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: center.lat,
          longitude: center.lng,
        },
        radius: 5000.0,
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Error in response: ", response.status);
      const errorDetail = await response.text();
      console.error("Error Detail: ", errorDetail);
      return;
    }

    const data = await response.json();
    createMarkersForPlaces(data.places);
  } catch (error) {
    console.error("Error in fetching data: ", error);
  }
}

function createMarkersForPlaces(places) {
  places.forEach((place) => {
    if (!place.location) return;

    // Extract the 'text' property from 'place.displayName' if it's an object
    let markerTitle = "";
    if (typeof place.displayName === "string") {
      markerTitle = place.displayName;
    } else if (
      place.displayName &&
      typeof place.displayName === "object" &&
      place.displayName.text
    ) {
      markerTitle = place.displayName.text;
    } else {
      markerTitle = "Unknown EV Charger"; // Default title if displayName is not properly formatted
    }

    const marker = new google.maps.Marker({
      map: map,
      position: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
      title: markerTitle,
    });

    // Prepare content for InfoWindow
    const infoWindowContent = `<div><strong>${markerTitle}</strong><br>${
      place.formattedAddress || "No Address"
    }</div>`;

    // Create and open InfoWindow immediately
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      disableAutoPan: true,
    });
    infoWindow.open(map, marker);

    // Optionally, if you still want to close the InfoWindow on click, you can add a click listener
    marker.addListener("click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  const message = browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.";
  console.error(message);
  // Implement additional error handling or user notification as needed
}

let map; // Global map variable
