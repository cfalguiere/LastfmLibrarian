/*
describe("Twice", function () {
  var librarian = require('../index.js');

  it("should show aa when parameter is a", function () {
    expect( librarian.twice('a') ).toBe('aa');
  });
});
*/

describe("Librarian", function () {

  var librarian = require('../index.js');
  var LastfmAPI = require('lastfmapi');

  describe("Echo", function () {

    it("should show a when parameter is a", function () {
      expect( librarian.echo('a') ).toBe('a');
    });

  });

  describe("Twice", function () {

    it("should show aa when parameter is a", function () {
      expect( librarian.twice('a') ).toBe('aa');
    });

  });

});
