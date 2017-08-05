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




// basic data for example-data
modelData = [
    {
        name: "Bergmann Pizza",
        yelpID: "bergmann-pizza-berlin-2",
        category: "food",
        fsquareID: "4ece1682e3007feb7ad1bd94"
    },
    {
        name: "L'Angolo del Gelato",
        yelpID: "l-angolo-del-gelato-berlin-2",
        category: "food",
        fsquareID: "4e89c3e1d22d940664f12faf"
    },
    {
        name: "Pharmacy: Alte Spree Apotheke",
        yelpID: "alte-spree-apotheke-berlin",
        category: "other",
        fsquareID: "532d9a8e498ec8516363d00d"
    },
    {
        name: "Borsighallen",
        yelpID: "hallen-am-borsigturm-berlin?osq=borsighallen",
        category: "shopping",
        fsquareID: "4b8d374ff964a520deed32e3"
    },
    {
        name: "Lucky Chinese",
        yelpID: "lucky-chinese-berlin",
        category: "food",
        fsquareID: "4cfb87c0feec6dcb2b314736"
    }
];


var model = function(modelData) {
    var self = this;
    this.name = modelData.name;
    this.id = modelData.fsquareID;
    this.category = modelData.category;
    this.visible = ko.observable();
    this.URL = '';
    this.street = '';
    this.city = '';
    this.hours = '';
    this.rating = '';

    var fsquareURL = 'https://api.foursquare.com/v2/venues/' + this.id + '&client_id=15S4QDKN4EJG4MNX2XPXUSLBWB3ADMHJYJY5PA2FOZNPHLTK&client_secret=PPCH5JDLNLMPTFBWFBEUO4GOO3B4HIVNZ0IRYJMLRNGTWVHK';

    $.ajax({
        type: 'GET',
        url: 'fsquareURL',
        dataType: 'json',
        success: function(response) {
            fsquare = response.response;
            console.log("getJSON success");
            window.fsquare = fsquare;
        }
    });

    // if you click a search result, the info-bubble above the corresponding
    // marker shall be opened
    this.showInfo = function() {
        console.log("you clicked " + self.name);
    }

}

function viewModel() {
    var self = this;  // use self inside the viewModel for clear distinguishing
    this.Query = ko.observable('');
    this.itemlist = ko.observableArray([]);

    // populate the itemlist with all items from our model-data
    modelData.forEach(function(item) {
        self.itemlist.push(new model(item));
        console.log(self.name);
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

ko.applyBindings(new viewModel());
