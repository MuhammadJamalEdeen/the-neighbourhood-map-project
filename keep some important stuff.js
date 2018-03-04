// Takes a JavaScript value and returns a JSON-encoded string.
//JSON.stringify



// takes such a string and converts it to the value it encodes.
//JSON.parse


// Spencer Eick's
$.ajax({
    url: 'https://api.foursquare.com/v2/venues/explore',
    dataType: 'json',
    data: {
        client_id: "0UUNK1HCPIDNERJDEJ1GIJ5VR115A4DWHRFLNTFA0H2Z21HR",
        client_secret: "M3LBGXZEFIHFW1RF5ITTHAEQ44BS1OCPOQG30ZTC0A5BYPH0",
        v: '20180213',
        ll: "40.762428,-73.973794",
        query: "Trump Tower"
    },
    success: function (response) {
        // Do something with the JSON response object
        console.log(response.response.groups[0].items[0].tips[0].text);
    }
});



// The old AJAX
function handleError(jqXHR, textStatus, errorThrown) {
    alert(jqXHR.responseText);
}

for (let i = 0; i < places.length; i++) {
    // AJAX request for the foursquare API.
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/explore',
        dataType: 'json',
        data: {
            client_id: "0UUNK1HCPIDNERJDEJ1GIJ5VR115A4DWHRFLNTFA0H2Z21HR",
            client_secret: "M3LBGXZEFIHFW1RF5ITTHAEQ44BS1OCPOQG30ZTC0A5BYPH0",
            v: '20180213',
            ll: `${places[i].location.lat},${places[i].location.lng}`,
            query: places[i].name
        },
        success: function (response) {
            places[i].API_Info = response.response.groups[0].items[0].tips[0].text;
        },
        error: handleError
    });
}


