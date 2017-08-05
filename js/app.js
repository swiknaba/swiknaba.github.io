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
        category: "food"
    },
    {
        name: "L'Angolo del Gelato",
        yelpID: "l-angolo-del-gelato-berlin-2",
        category: "food"
    },
    {
        name: "Pharmacy: Alte Spree Apotheke",
        yelpID: "alte-spree-apotheke-berlin",
        category: "other"
    },
    {
        name: "Borsighallen",
        yelpID: "hallen-am-borsigturm-berlin?osq=borsighallen",
        category: "shopping"
    },
    {
        name: "Lucky Chinese",
        yelpID: "lucky-chinese-berlin",
        category: "food"
    }
];


var model = function(modelData) {
    var self = this;
    this.name = modelData.name;
    this.yelpID = modelData.yelpID;
    this.category = modelData.category;
    this.visible = ko.observable();

    // use jQuery: http://api.jquery.com/jQuery.getJSON/
    // to fetch information about our data from yelp
    // Yelp: https://www.yelp.com/developers/documentation/v3/business
    var yelpURL = `https://api.yelp.com/v3/businesses/${this.yelpID}`;
    $.ajax({
        type: "GET",
        beforeSend: function(request) {
            request.withCredentials = true;
            request.setRequestHeader("Authorization", "Bearer " + localStorage['token']);
        },
        url: yelpURL,
        dataType: "jsonp",
        success: function(yelp_jqxhr) {
            console.log("es klappt");
            // var yelp = yelp_jqxhr.responseJSON;
            window.yelp = yelp_jqxhr;
        },
        fail: function() {
            alert("Sorry, we are having problems fetching the relevant information from YELP. Please try refreshing your browser.");
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
