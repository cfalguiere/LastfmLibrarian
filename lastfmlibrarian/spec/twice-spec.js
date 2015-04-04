describe("Twice", function () {
  var librarian = require('../index.js');

  it("should show aa when parameter is a", function () {
    expect( librarian.twice('a') ).toBe('aa');
  });
});