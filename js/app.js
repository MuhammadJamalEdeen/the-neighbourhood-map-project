// An array representing our data.
var places = [
    {
        name: "Empire State Building",
        location: {
            lat: 40.748441,
            lng: -73.985664
        },
        marker: null
    },
    {
        name: " WNYC Transmitter Park",
        location: {
            lat: 40.729845,
            lng: -73.960768
        },
        marker: null
    },
    {
        name: "Calvary Cemetery",
        location: {
            lat: 40.738945,
            lng: -73.912132
        },
        marker: null
    },
    {
        name: "Trump Tower",
        location: {
            lat: 40.762428,
            lng: -73.973794
        },
        marker: null
    },
    {
        name: "Stevens Institute of Technology",
        location: {
            lat: 40.744838,
            lng: -74.025683
        },
        marker: null
    },
    {
        name: "Socrates Sculpture Park",
        location: {
            lat: 40.768479,
            lng: -73.936636
        },
        marker: null
    },
    {
        name: "Tenement Musuem",
        location: {
            lat: 40.718796,
            lng: -73.990070
        },
        marker: null
    }
];

var ViewModel = function () {
    var self = this;
    var filterResult;
    // An observable array for our places.
    this.famousPlaces = ko.observableArray(places);
    // An observable to hold our filter string.
    this.filter = ko.observable("");
    this.showFilteredMarkers = ko.observable();

    // The computed observable responsible for filtering the list.
    // attributes: https://www.codeproject.com/Articles/822879/Searching-filtering-and-sorting-with-KnockoutJS-in.
    this.filteredPlaces = ko.computed(function () {
        if (!self.filter()) {
            filterResult = self.famousPlaces();
        } else {
            filterResult = ko.utils.arrayFilter(self.famousPlaces(), function (place) {
                return (
                    (self.filter().length === 0 || place.name.toLowerCase().indexOf(self.filter().toLowerCase()) > -1)
                );
            });
        }

        //  Update the map markers when a filter is apllied.
        self.showFilteredMarkers(filterResult, self.famousPlaces());

        return filterResult;
    });

    // A function responsible for updating the map to display only the filtered markers.
    this.showFilteredMarkers = function (filteredPlacesArray, placesArray) {
        for (let i = 0; i < placesArray.length; i++) {
            if (placesArray[i].marker !== null) {
                placesArray[i].marker.setMap(null);
            }
        }

        for (let i = 0; i < filteredPlacesArray.length; i++) {
            if (placesArray[i].marker !== null) {
                filteredPlacesArray[i].marker.setMap(map);
            }
        }
    };

    // A function for handling the click event of the list items.
    this.handleInfoWindow = function (place) {
        if (place.marker !== null) {
            populateInfoWindow(place.marker, largeInfowindow, place);
        }
    };
};

ko.applyBindings(new ViewModel());

// Variables for holding the necessary infos needed to set up the Google maps API data.
var map;
var largeInfowindow;
var bounds;
var markers = [];

// A function responsible for setting up the map and the markers.
function initMap() {
    // Constructor creates a new map.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    });

    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    // Creating markers and their properties.
    for (var i = 0; i < places.length; i++) {
        createMarkers(places[i]);
        bounds.extend(markers[i].position);
    }

    function createMarkers(place) {
        // Get the position from the places array.
        var position = place.location;
        var title = place.name;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Push the marker to our array of markers and to the property of the corresponding place.
        markers.push(marker);
        place.marker = marker;

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow, place);
        });
    }

    // Extend the boundaries of the map for each marker.
    map.fitBounds(bounds);
}

// A function responsible for bouncing the marker.
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// A variable to hold the API response data.
var APIResult;

// This function populates the infowindow when either the location's name or its corresponding marker // is clicked. We'll only allow only one infowindow at a time.
function populateInfoWindow(marker, infowindow, place) {
    // AJAX request for the foursquare API.
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/explore',
        dataType: 'json',
        data: {
            client_id: "0UUNK1HCPIDNERJDEJ1GIJ5VR115A4DWHRFLNTFA0H2Z21HR",
            client_secret: "M3LBGXZEFIHFW1RF5ITTHAEQ44BS1OCPOQG30ZTC0A5BYPH0",
            v: '20180726',
            ll: `${place.location.lat},${place.location.lng}`,
        },
    }).done(function (data, textStatus, jqXHR) {
        APIResult = data.response.groups[0].items[0].venue.location.formattedAddress;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("Failed to fetch the details of the location from the Foursquare API.");
    }).then(function () {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(`<div><b>${marker.title}<b></div><p>${APIResult}</p>`);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
        toggleBounce(marker);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1425);
    });
}

// A function to be called upon any error with the Google maps API.
function googleErrorHandler() {
    alert("Error loading the Google Maps API");
}
