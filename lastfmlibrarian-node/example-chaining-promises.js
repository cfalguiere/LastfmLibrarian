  var pr1 = new Promise( function(resolve, reject) {
     resolve( "A" );
  });

  pr1
  .then( function (res) {
    console.log(res);
    return   new Promise(function(resolve, reject) {
     resolve( res  + "B" );
    });
  }).then( function (res) {
    console.log(res);
  });

  var pr2 = new Promise( function(resolve, reject) {
     resolve( [ "A", "B" ] );
  });

  pr2
  .then( function (res) {
    console.log(res);
    var items = [];
    for (i = 0; i < res.length; i++) {
      var p =  new Promise(function(resolve, reject) {
         resolve( res[i] + "Z" );
      });
      items.push( p );
    }
    return Promise.all(items);
  }).then( function (res) {
    console.log(res);
  });

/*
