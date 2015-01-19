// adapted from EchoNest example by Paul Lamere
// https://github.com/plamere/en-demos/blob/master/tp/tasteprofile.html

var en;
en = new EchoNest(enKey);

// Default Taste Profile ID
var userCatalogID = 'CAFBVXR14AFF07D30D';

function getArtistUpdateBlock() {
  var artists = $("#artists").val();
  artists = artists.split(",");
  var blocks = [];
  $.each(artists, 
    function(index, artist) {
      var artist = $.trim(artist);
      var item = {
          action : 'update',
          item : {
              item_id : 'item-' + index,
              artist_name: artist,
              favorite : true
          }
      }
      blocks.push(item);
    }
  );
  return blocks;
}


// initialize a new taste profile (not currently being used)
function createTasteProfile() {
  var blocks = getArtistUpdateBlock();

  console.log(blocks);
  if (blocks.length <= 2) {
      alert("Sorry, need at least 3 artists. More is better");
  } else {
    info("Creating your very own Taste Profile");
    var catName = 'manual-' + Math.round(Math.random() * 10000000);
    en.catalog.create(catName, 
      function(data) {
        var catID = data.response.id;
        updateTasteProfile(catID, blocks);
      },
      function(data) {
        error("Couldn't create catalog " + catName);
      }
    );
  }
}

function addToDefaultTasteProfile(catID) {
  var blocks = getArtistUpdateBlock();
  updateTasteProfile(catID, blocks);
}

function updateTasteProfile(catID, blocks) {
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
            var percent = 20 + Math.round(80 * data.response.percent_complete / 100.0)
            info("Resolving artists " + percent + " % complete");
            progressBar.css('width', percent  + '%');
          } else if (data.response.ticket_status === 'complete') {
            progressBar.css('width', '100%');
            info("Done!");
            tasteProfileReady(catID);
            //
            suggestArtists();
          } else {
            error("Can't resolve taste profile " + data.response.details);
          }
        },
        function() {
          error("Trouble waiting for catalog");
        }
      );
    },

    // error
    function(data) {
      error("Trouble adding artists to catalog");
    });
}

function tasteProfileReady(id) {
    info("We've got everything we need, here we go ...");
    userCatalogID = id;
    $.cookie('tpdemo_catalog_id', id, {expires:365, path: '/' });
    // startPlaying();
}


// updates the info field
function info(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-info");
    }
    $("#info").text(s);
}

function error(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-error");
    }
    $("#info").text(s);
}

function initUI() {
  $("#artists").keydown(
    function(){
      if (event.keyCode == 13) {
        $("#status").show();
        addToDefaultTasteProfile(userCatalogID);
      }
    }
  );

  $("#go").click( 
    function() {
      $("#status").show();
        addToDefaultTasteProfile(userCatalogID);
      }
  );
}


$(document).ready(function() {
  initUI();
  initLocation();
});

/** taste profiles

  //  CAQVGUW14AFEF2CE32

  CURRENT: CAFBVXR14AFF07D30D
 */