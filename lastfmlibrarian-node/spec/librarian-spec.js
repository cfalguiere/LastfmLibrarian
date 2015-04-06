describe("Librarian", function () {

  var librarian = require('../index.js');
  var LastfmAPI = require('lastfmapi');
  var Promise = require('promise');
  var fs = require('fs');

  var session = null;

  beforeEach(function() {
      if (session != null)
        return;

      var configFileName = 'lastfm_config.json';
      try {

        var tmpConfig = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
        expect(tmpConfig).toBeDefined();
        expect(tmpConfig.api).toBeDefined();
        expect(tmpConfig.api.api_key).toBeDefined();
        expect(tmpConfig.api.api_key.length).toBeGreaterThan(10);
        expect(tmpConfig.api.secret).toBeDefined();
        expect(tmpConfig.api.secret.length).toBeGreaterThan(10);

        var appkey = tmpConfig.api;

        session = librarian.createSession(appkey);
        expect( session.api.api_key ).toBe(appkey.api_key);
        expect( session.api.secret ).toBe(appkey.secret);

      }
      catch (e) {
        console.log("Could not load last.fm configuration file");
        console.log(e);
        expect(lastfmConfig).not.toBeNull();
      }

  });



  describe("findTopTenOfArtist", function () {

    it("should return 10 tracks", function () {

      expect( session ).not.toBeNull();

      var artistName = "Portishead";

      var top = null;
      var done = false;
      librarian.findTopTenOfArtist(artistName).then( function (res){
        top = res;
        done = true;
      }).catch(function(e) {
        console.log("Exception when calling findTopTenOfArtist");
        console.log(e);
        done = true;
      });

      waitsFor(function() {
        return done;
      }, "Timed out", 10000);

      runs(function() {
        expect( top ).not.toBeNull();
        expect( top.track.length ).toBe(10);
      });

    });

  });



  /*
  describe("GetTrackInfo", function () {

    it("should show the title", function () {
      var artistName = 'Portishead';
      var trackName = 'Wandering Star';

      function checkAssertion(err, track) {
        if (err) { console.log(err); throw err; }
        expect(track.name).toBe(trackName);
      };

      librarian.getTrackInfo(artistName, trackName, checkAssertion);
    });

  });

  describe("GetTrackInfo2", function () {

    it("should show the title", function () {
      var artistName = 'Portishead';
      var trackName = 'Wandering Star';

      var done = false;
      var receivedTrackName = '';
      function extracter(err, track) {
        if (err) { console.log(err); throw err; }
        done = true;
        receivedTrackName = track.name;
      };


      librarian.getTrackInfo(artistName, trackName, extracter);

      waitsFor(function() {
            return done;
        },  "It took too long to find those factors.", 10000);

      runs(function() {
        expect(receivedTrackName).toBe(trackName);
      });

    });

  });
  */
});
