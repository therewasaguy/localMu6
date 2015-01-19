function suggestArtists() {
  // seed catalog is the user TasteProfile
  var seedCatalog = userCatalogID;
  var bucketID = locationID;

  var enRequest = 'http://developer.echonest.com/api/v4/artist/similar?api_key='+enKey+'&seed_catalog='+seedCatalog+'&bucket=id:'+bucketID+'&limit=true&results=10';

  $.getJSON(enRequest, parseSuggestions);
}

function parseSuggestions(data) {
  console.log(data);
}
