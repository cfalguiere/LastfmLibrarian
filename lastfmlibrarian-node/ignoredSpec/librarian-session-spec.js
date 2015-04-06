describe("Librarian-Session", function () {

  var librarian = require('../index.js');
  var LastfmAPI = require('lastfmapi');
  var Promise = require('promise');
  var fs = require('fs');

  var lastfmConfig = null;

  beforeEach(function() {
      if (lastfmConfig != null)
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

        lastfmConfig = tmpConfig;

      }
      catch (e) {
        console.log("Could not load last.fm configuration file");
        console.log(e);
        expect(lastfmConfig).not.toBeNull();
      }

  });


  describe("CreateSession", function () {

    it("should show the session apikey", function () {
      var appkey = {
        'api_key' : 'MY_API_KEY',
        'secret' : 'MY_API_SECRET'
      }
      var session = librarian.createSession(appkey);
      expect( session.api.api_key ).toBe(appkey.api_key);
      expect( session.api.secret ).toBe(appkey.secret);
    });

  });

  describe("VerifySession", function () {

    it("should succeed", function () {

      expect( lastfmConfig ).not.toBeNull();
      var appkey = lastfmConfig.api

      var session = librarian.createSession(appkey);
      expect( session.api.api_key ).toBe(appkey.api_key);
      expect( session.api.secret ).toBe(appkey.secret);

      var done = false;
      var status = false;
      librarian.verifySession().then(function (res){
        status = res;
        done = true;
      })

      waitsFor(function() {
        return done;
      }, "Timed out", 5000);

      runs(function() {
        expect( status ).toBe( true );
      });

    });

    it("should succeed", function () {
      var appkey = {
        'api_key' : 'WRONG_API_KEY',
        'secret' : 'WRONG_API_SECRET'
      }
      var session = librarian.createSession(appkey);
      expect( session.api.api_key ).toBe(appkey.api_key);
      expect( session.api.secret ).toBe(appkey.secret);

      var done = false;
      var status = true;
      librarian.verifySession().then(function (res){
        status = res;
        done = true;
      })

      waitsFor(function() {
        return done;
      }, "Timed out", 5000);

      runs(function() {
        expect( status ).toBe( false );
      });

    });

  });


});
