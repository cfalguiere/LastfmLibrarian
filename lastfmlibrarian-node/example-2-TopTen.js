
var librarian = require('./index.js');
var Promise = require('promise');
var fs = require('fs');

var session = null;
var configFileName = 'lastfm_config.json';
try {

  var lastfmConfig = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  session = librarian.createSession(lastfmConfig.api);
  //var appkey = { "api_key" : "TODO_ENTER_YOURS_HERE",
  //             "secret" : "TODO_ENTER_YOURS_HERE" };
  //session = librarian.createSession(appkey);
  librarian.verifySession().then(function (res){
    //console.log(res);
  })

}
catch (e) {
  console.log("Loading Last.fm configuration. Could not read the configuration file " + configFileName);
  console.log(e);
  return false;
}

  var artistName = "Portishead";
  //var artistName = "ABCDEF";

/*
  librarian.findTopTenOfArtist(artistName).then( function (tracks) {
      console.log(tracks);
      return "OK";
  }, function(e) {
    console.log("Exception while processing artist " + artistName );
    console.log(e);
  });

*/
  librarian.findTopTenOfArtist(artistName).then( function (tracks) {
      console.log(tracks);
      return "OK";
  }).then( function (res) {
    console.log(res);
  }).catch(function(e) {
    console.log("Exception while processing artist " + artistName );
    console.log(e);
  });;
