var librarian = require('./index.js');
var Promise = require('promise');
var fs = require('fs');

var session = null;
var configFileName = 'lastfm_config.json';
try {

  var lastfmConfig = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  //var appkey = { "api_key" : "TODO_ENTER_YOURS_HERE",
  //             "secret" : "TODO_ENTER_YOURS_HERE" };
  session = librarian.createSession(lastfmConfig.api);
  console.log( session );
  librarian.verifySession().then(function (res){
    console.log(res);
  })

}
catch (e) {
  console.log("Loading Last.fm configuration. Could not read the configuration file " + configFileName);
  console.log(e);
  return false;
}


