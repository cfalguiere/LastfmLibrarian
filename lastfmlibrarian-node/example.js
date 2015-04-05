
var librarian = require('./index.js');
var Promise = require('promise');
var fs = require('fs');

var configFileName = 'lastfm_config.json';
try {

  var lastfmConfig = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  var session = librarian.createSession(lastfmConfig.api);
  console.log( session );
  librarian.verifySession().then(function (res){
    console.log(res);
  })

}
catch (e) {
  console.log("Loading Last.fm configuration. Could not read the configuration file " + configFileName);
  console.log(e);
}

/*
session.chart.getTopTracks( { page : 0, limit: 1 }, function (err, chart) {
  if (err) { console.log(err); throw err; }
  console.log(chart);
});
*/



/*
var track = lfm.track.getInfo(
  {
    'artist' : artistName,
    'track' : trackName,
  }, function (err, track) {
    if (err) { console.log(err); throw err; }
    console.log("received track");
    console.log(track);
  });

*/


/*
var artistName = 'Portishead';
var trackName = 'Wandering Star';

var track = librarian.getTrackInfo(artistName, trackName, function (err, track) {
        if (err) { console.log(err); throw err; }
        console.log("received track");
        console.log(track);
        console.log(track.name);
      });

console.log(track);
*/
