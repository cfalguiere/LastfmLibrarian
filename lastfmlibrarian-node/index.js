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
        if (err) { console.log(err); resolve(false); }
        resolve(true);
      });
    } else {
      resolve(false);
    }

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
  verifySession : verifySession
};
