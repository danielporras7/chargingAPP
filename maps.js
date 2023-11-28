function initMap() {
  const defaultLocation = { lat: -34.397, lng: 150.644 };

  const map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 15
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(userLocation);

        // Add a marker for the user's location
        const userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Optional: a custom icon URL
          }
        });

        searchNearby(map, userLocation);
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function searchNearby(map, center) {
  const request = {
    location: center,
    radius: '5000', // Adjust as needed
    type: ['electric_vehicle_charging_station']
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results, map);

      // Handle pagination here
    }
  });
}

function createMarkers(places, map) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  console.log(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
  // You can handle errors or fallbacks here
}


function openForm(formId) {
  var form = document.getElementById(formId);
  if (form.style.display === "block") {
    form.style.display = "none";
  } else {
    form.style.display = "block";
  }
}


function closeForm(formId) {
  var form = document.getElementById(formId);
  form.style.display = "none";
}
