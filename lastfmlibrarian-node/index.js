function echo(s) {
    return s;
};

function twice(s) {
    return s + s;
};

var LastfmAPI = require('lastfmapi');
var Promise = require('promise');

var session = null;
var username = null;

function createSession(appkey) {
  // Set up the session
  var lfm = new LastfmAPI(appkey);
  session = lfm;
  return lfm;
}

function verifySession() {
  return new Promise(function(resolve, reject) {
    var status = false;

    if (session != null) {
      session.chart.getTopTracks( { page : 0, limit: 1 }, function (err, chart) {
        if (err) { /*console.log(err);*/ resolve(false); }
        resolve(true);
      });
    } else {
      resolve(false);
    }

  });
}

function registerUser(userCredentials) {
  session.setSessionCredentials(userCredentials.username, userCredentials.key);
  username = userCredentials.username;
}

function registeredUser() {
  return username;
}


// Public

function findTopTenOfArtist(artistName) {
  return new Promise(function(resolve, reject) {
      session.artist.getTopTracks(
        { artist : artistName, autocorrect: 1,
          page: 0, limit: 10
        }, function (err, top) {
          if (err) { /*console.log(err);*/ reject(err); }
            resolve(top);
        });
  });
}

// Authenticated

function findUserTrackInfo(artistName, trackName) {
  return new Promise(function(resolve, reject) {
        session.track.getInfo(
          { artist : artistName, track : trackName, autocorrect: 1,
            username : username
          }, function (err, trackInfo ) {
                if (err) { reject(err); }
                resolve( trackInfo );
              });
    });
 }



function selectTrackUserTags(artistName, trackName, username) {
  return new Promise(function(resolve, reject) {
        session.track.getTags(
          { artist : artistName, track : trackName, autocorrect: 1,
           user : username
          }, function (err, tags) {
                if (err) { console.log(err); reject(err); }
                else { resolve( { artist: artistName,
                           track: trackName,
                           tags : tags.tag } );
                     }
              });
    });
 }



module.exports = {
  twice : twice,
  echo : echo,
  getTrackInfo : getTrackInfo,
  createSession : createSession,
  verifySession : verifySession,
  registerUser : registerUser,
  registeredUser : registeredUser,
  findTopTenOfArtist : findTopTenOfArtist,
  findUserTrackInfo : findUserTrackInfo,
  selectTrackUserPlaycount : selectTrackUserPlaycount,
  selectTrackUserTags : selectTrackUserTags
};
