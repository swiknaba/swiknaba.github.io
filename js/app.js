/*
var ViewModel = function() {
    var self = this;  // self represents the view-model to access outer-this

    this.clickCount = ko.observable(0);
    this.name = ko.observable('Dude');
    this.imgSrc = ko.observable('img/foo_bar.jpg');
    this.imgAttribution = ko.observable('https://www.imgur.com/foo/bar/jo.jpg');

    this.currentCat = ko.observable( new Cat() );

    this.incrementCounter = function() {
        self.clickCount(self.clickCount() + 1);
    };
}


// note the "this" as second argument of the computed-function, so that you
// can use "this" inside the function with it refering to the outer-this
// (this.fullName)
// ko.computed can compute cool stuff out of your model-data and you will have
// access to it like a variable "this.fullName"
function AppViewModel() {
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();
    }, this);
}

ko.applyBindings(new ViewModel);
*/

// Model: holds all the data, no logic => written inside JS file
// ViewModel: holds all the logic => written inside JS file
// View: HTML/CSS -> use "data-bind" to connect to Model/ViewModel
// Notes:
// The View actually just shows an up-to-date version of the ViewModel,
// which tells how data from the Model shall be presented. If data or the
// behavior of the data (ViewModel) change, the View is updated

// viewModel as function or as object literal?
// https://stackoverflow.com/questions/9589419/difference-between-knockout-view-models-declared-as-object-literals-vs-functions

// ============================================================================
// FIRST initialize google map
// https://developers.google.com/maps/documentation/javascript/tutorial
var map;
  // there are several zoom levels:
  // 1: world, 5: continent, 10: city, 15: streets, 20: buildings
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.588862, lng: 13.278735},
        zoom: 15,
        mapTypeControl: false
    });
}
// finished with google map
// ============================================================================

// YELP:
// Client ID
// TZ53SO335VUAeUt14E0eGQ
// Client Secret
// mfM2XOraxM0KhCsrXjBKXnuCAGM208cTYPxq7jXr1Dc2XqWHt4amItP9Z9IdyhBD




//example-data, all in Berlin, district Alt-Tegel
modelData = [
    {
        name: "Bergmann Pizza",
        yelpID: "bergmann-pizza-berlin-2",
        category: "food",
        fsquareID: "4ece1682e3007feb7ad1bd94",
        lat: 52.589969,
        lng: 13.281440
    },
    {
        name: "L'Angolo del Gelato",
        yelpID: "l-angolo-del-gelato-berlin-2",
        category: "food",
        fsquareID: "4e89c3e1d22d940664f12faf",
        lat: 52.589428,
        lng: 13.281779
    },
    {
        name: "Alte Spree Apotheke",
        yelpID: "alte-spree-apotheke-berlin",
        category: "other",
        fsquareID: "532d9a8e498ec8516363d00d",
        lat: 52.592183,
        lng: 13.282605
    },
    {
        name: "Borsighallen",
        yelpID: "hallen-am-borsigturm-berlin?osq=borsighallen",
        category: "shopping",
        fsquareID: "4b8d374ff964a520deed32e3",
        lat: 52.584968,
        lng: 13.286043
    },
    {
        name: "Lucky Chinese",
        yelpID: "lucky-chinese-berlin",
        category: "food",
        fsquareID: "4cfb87c0feec6dcb2b314736",
        lat: 52.588512,
        lng: 13.278548
    },
    {
        name: "R\u00fcan-Thai",
        category: "food",
        lat: 52.588118,
        lng: 13.286179
    },
    {
        name: "Schloss-Apotheke Tegel",
        category: "other",
        lat: 52.588731,
        lng: 13.284178
    },
    {
        name: "Intersport Voswinkel",
        category: "shopping",
        lat: 52.584321,
        lng:  13.286233
    },
    {
        name: "Holi",
        category: "food",
        lat: 52.586944,
        lng: 13.281101
    }
];


// foursquare credentials
var clientID = "15S4QDKN4EJG4MNX2XPXUSLBWB3ADMHJYJY5PA2FOZNPHLTK";
var clientSecret = "PPCH5JDLNLMPTFBWFBEUO4GOO3B4HIVNZ0IRYJMLRNGTWVHK&v=20170801";


// the model, which defines information and functions on our model-data
var model = function(modelData) {
    var self = this;
    this.name = modelData.name;
    this.id = modelData.fsquareID;
    this.category = modelData.category;  // one of three categories (food, shopping, other)
    this.visible = ko.observable();
    this.lat = modelData.lat;
    this.lng = modelData.lng;
    this.street = '';
    this.city = '';
    this.openingTimes = '';  // Contains the opening hours of this point of interest
    this.rating = '';  // Numerical rating of the venue (0 through 10)
    this.cat = '';  // more precise category (e.g. Pizza Place)

    // API endpoint of forsquare, check out: https://developer.foursquare.com/docs/venues/search
    // OAuth doesn't allow CORS, so one can't directly fetch location info via the forsquareID, see: https://developer.foursquare.com/docs/venues/venues
    // since we want to only use frontend for this project
    var fsquareURL =  'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170804' + '&query=' + this.name + '&limit=1';

    // ajax call to get information on point of interest
    // response: https://developer.foursquare.com/docs/responses/venue
    $.ajax({
        type: 'GET',
        url: fsquareURL,
        dataType: 'json',
        success: function(data) {
            fsquare = data.response.venues[0];
            console.log("getJSON success: " + self.name);
            self.street = fsquare.location.address;
            self.city = fsquare.location.city;
            self.openingTimes = fsquare.hours;
            self.rating = fsquare.rating;
            self.cat = fsquare.categories[0].shortName;
            // some values might be undefined if not provided, re-set those to empty string
            if (typeof self.street == 'undefined') { self.street = '<i>unknown</i>'; }
            if (typeof self.city == 'undefined') { self.city = ''; }
            if (typeof self.openingTimes == 'undefined') { self.openingTimes = '<i>not available..</i>'; }
            if (typeof self.rating == 'undefined') { self.rating = '<i>not yet rated...</i>'; }
            if (typeof self.cat == 'undefined') { self.cat = ''; }

            // generate info-windows for each marker, following the documentation
            // https://developers.google.com/maps/documentation/javascript/infowindows
            // with improved string-concenation (just for fun)
            var contentString = [];
            contentString.push('<div class="contentString">',
                                  '<p><b>', self.name, '</b>',
                                  '<br><i>', self.cat, '</i></p>',
                                  '<p>', self.street, '<br>', self.city, '</p>',
                                  '<p>Opening hours:<br>', self.openingTimes, '</p>',
                                  '<p>User rating (0-10): ', self.rating, '</p>',
                               '</div>');
            self.infowindow = new google.maps.InfoWindow({
                content: contentString.join('')
            });
            self.marker.addListener('click', function() {
                self.infowindow.open(map, self.marker);
            });
        },
        fail: function() {
            alert("Sorry, we are having problems fetching information from foursquare. Pleasy try refreshing your browswer page.");
        }
    });

    // if you click a search result, the info-bubble above the corresponding
    // marker shall be opened
    this.showInfo = function() {
        console.log("you clicked " + self.name);
        console.log("id: " + self.id);
        console.log("category: " + self.category);
        console.log("street: " + self.street);
        console.log("city: " + self.city);
        console.log("opening times: " + self.openingTimes);
        console.log("rating: " + self.rating);
        console.log("cat: " + self.cat);
        self.infowindow.open(map, self.marker);
    }

    // generate map-markers
    // custom icons: https://sites.google.com/site/gmapsdevelopment/
    switch (self.category) {
        case "food":
            var iconLink = 'http://maps.google.com/mapfiles//kml/pal2/icon32.png';
            break;
        case "shopping":
            var iconLink = 'http://maps.google.com/mapfiles//kml/pal3/icon26.png';
            break;
        case "other":
            var iconLink = 'http://maps.google.com/mapfiles//kml/pal3/icon53.png';
            break;
    }
    this.marker = new google.maps.Marker({
        position: {lat: this.lat, lng: this.lng},
        title: this.name,  // appears as tooltip
        icon: iconLink
    });
    // add marker to the map (necessary if not called within initMap)
    this.marker.setMap(map);
}


function viewModel() {
    var self = this;  // use self inside the viewModel for clear distinguishing
    this.Query = ko.observable('');
    this.itemlist = ko.observableArray([]);

    // init google maps
    initMap();

    // populate the itemlist with all items from our model-data
    modelData.forEach(function(item) {
        self.itemlist.push(new model(item));
    });

    // generate list which results from search-input
    this.searchResults = ko.computed(function() {
        var filter = self.Query().toLowerCase();
        return ko.utils.arrayFilter(self.itemlist(), function(item) {
            var result = (item.name.toLowerCase().search(filter) >= 0);
            item.visible(result);
            return result;
        });
    });

}

// "Uncaught ReferenceError: google is not defined" @ "this.marker = new google.maps.Marker({.." inside
// "var model = function" because that used to run bevore the map is loaded, so we have to run all application code
// after the map is loaded
function runApp() {
    ko.applyBindings(new viewModel());
}
