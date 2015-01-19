var locationID = 'CAJADHB14AFF1CFE3D';
var locationName = 'NYC_test0';

function initLocation() {
  // createNewCatalog(locationName);
  $.getJSON('data/bandsintown-events.json', importUpcomingEvents);
}

function importUpcomingEvents(someJSON) {
  console.log(someJSON);
  var blocks = parseBandsintown(someJSON);
  updateLocationProfile(locationID, blocks);
}

function parseBandsintown(someJSON) {
  var blocks = [];
  var index = 0;

  $.each(someJSON, 
    function(placeholder, show) {

      // TO DO:
      // database: see if artist already exists, if not initArtist, otherwise just append an event
      // show_id : show.id,
      // show_date : show.datetime
      // vanue: show.venue

      var artists = show.artists;
      // iterate thru artists
      for (var a in artists) {
        index++;
        var item = {
          action : 'update',
          item : {
              item_id : 'item-' + index,
              artist_name: artists[a].name,
              favorite : true
          }
          // TO DO: create an entry in our database using index as unique ID, and storing the event + venue data
        }
      blocks.push(item);
      }

    }
  );
  return blocks;
}

// create a new catalog
function createNewCatalog() {
  en.catalog.create(locationName, 
    function(data) {
      locationID = data.response.id;
    },
    function(data) {
      error("Couldn't create catalog " + locationName);
    }
  );
}

function updateLocationProfile(catID, blocks) {
  var progressBar = $("#progress-bar");
  info("Uploading your taste to The Echo Nest");
  progressBar.css('width', '20%');

  en.catalog.addArtists(catID, blocks,

    // callback
    function(data) {
      var ticket = data.response.ticket;
      en.catalog.pollForStatus(ticket, 
        function(data) {
          if (data.response.ticket_status === 'pending') {
            var percent = 20 + Math.round(80 * data.response.percent_complete / 100.0);
            info("Resolving artists " + percent + " % complete");
            progressBar.css('width', percent  + '%');
          } else if (data.response.ticket_status === 'complete') {
            progressBar.css('width', '100%');
            info("Done!");
            locationProfileReady(catID);
          } else {
            error("Can't resolve taste profile " + data.response.details);
          }
        },
        function() {
          error("Trouble waiting for location data catalog");
        }
      );
    },

    // error
    function(data) {
      error("Trouble adding artists to location catalog");
    });
}

function locationProfileReady() {
  console.log('location info has loaded!');
}