function echo(s) {
    return s;
};

function twice(s) {
    return s + s;
};

var LastfmAPI = require('lastfmapi');
var Promise = require('promise');

var session = null;

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

function selectTrackUserPlaycount(artistName, trackName, username) {
  return new Promise(function(resolve, reject) {
        session.track.getInfo(
          { artist : artistName, track : trackName, autocorrect: 1,
           username : username
          }, function (err, track) {
                if (err) { console.log(err); /*reject(err);*/ }
                resolve( { artist: track.artist.name,
                           track: track.name,
                           userplaycount : track.userplaycount } );
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



function getTrackInfo(artistName, trackName, callback) {
  var requiredTrack;

  // Set up the session
  var lfm = new LastfmAPI({
      'api_key' : '57e2d341a8664296206b920a55be84c5', //'MY_API_KEY', // REPLACE WITH YOUR OWN
      'secret' : 'b23c2d43c9844c9d23763b8e4428b41b' //'MY_API_SECRET' // REPLACE WITH YOUR OWN
  });

  // Get track info
  var track = lfm.track.getInfo(
      {
        'artist' : artistName,
        'track' : trackName,
      },
        callback
      /*
      function (err, track) {
        if (err) { console.log(err); throw err; }
        console.log("received track");
        console.log(track);
        requiredTrack = track;
      }*/
      );
  return track;
};

module.exports = {
  twice : twice,
  echo : echo,
  getTrackInfo : getTrackInfo,
  createSession : createSession,
  verifySession : verifySession,
  findTopTenOfArtist : findTopTenOfArtist,
  selectTrackUserPlaycount : selectTrackUserPlaycount,
  selectTrackUserTags : selectTrackUserTags
};
