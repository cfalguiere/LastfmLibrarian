describe("Librarian-Session", function () {

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


  describe("registerUser", function () {

    it("should set the username", function () {
      var userCredentials = {
          'username' : 'someone',
          'key' : 'akey'
      };

      librarian.registerUser(userCredentials);
      expect( librarian.registeredUser() ).toBe('someone');
    });

  });


});
