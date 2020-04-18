document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems);

});




var searchZip = "98103";

$("#search-address-button").on("click", "getCoordinatesFromAddress");

async function getMapsCenter() {
    // Location IQ gets the input of an address, and returns Coordinates
    // coordinates get dumped on addMarket

    $.ajax({
        type: "GET",
        url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&postalcode=" + searchZip + "&format=json"
    }).then(function (addressResponse) {
        addMarkerCenter(addressResponse[0].lat, addressResponse[0].lon);
    });
};

// Function that runs a search on nearby markets based on Coordinates
function getUsdaResults() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + searchZip,
        dataType: 'jsonp',
        // jsonpCallback: 'searchResultsHandler'
    }).then(searchResultsHandler);
}

function searchResultsHandler(usdaResponse) {

    // console.log(usdaResponse);

    var results = usdaResponse.results;
    var myIdArr = [];
    var marketNameArr = [];
    var ix = 0;

    for (var i = 0; i < results.length; i++) {

        var item = results[i]
        myIdArr.push(item.id);
        marketNameArr.push(item.marketname.substring(4));
    }

    var timer = setInterval(function () {
        ix;
        var myIdUsda = myIdArr[ix]
        var marketName = marketNameArr[ix];

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + myIdUsda,
            dataType: 'jsonp',
        }).then(function (detail) {
            var usdaMarketAddress = detail.marketdetails.Address;
            $.ajax({
                type: "GET",
                url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&q=" + usdaMarketAddress + "&format=json"
            }).then(function (addressResponse) {
                var lat = addressResponse[0].lat
                var lng = addressResponse[0].lon
                addMarker(lat, lng, marketName, ix)
                ix = ix + 1
            });
        });

        if (ix == 4) {
            clearInterval(timer);
        };
    }, 550);
};

function addMarkerCenter(lat, lng) {
    console.log(lat);
    console.log(lng);
};

function addMarker(lat, lng, marketName, ix) {
    console.log(ix);
    console.log(lat);
    console.log(lng);
    console.log(marketName);

};

getMapsCenter();
getUsdaResults();