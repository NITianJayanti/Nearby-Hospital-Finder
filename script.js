let map;
let service;
let infowindow;

function initMap() {
  // Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let userLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
      });

      new google.maps.Marker({
        position: userLocation,
        map,
        title: "You are here",
      });

      document.getElementById("search-btn").addEventListener("click", () => {
        findHospitals(userLocation);
      });
    });
  } else {
    alert("Geolocation not supported by this browser.");
  }
}

function findHospitals(location) {
  const request = {
    location: location,
    radius: "3000", // search within 3km
    type: ["hospital"], // can also use ["pharmacy", "doctor"]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow = new google.maps.InfoWindow({
      content: `<strong>${place.name}</strong><br>${place.vicinity}`,
    });
    infowindow.open(map, marker);
  });
}
