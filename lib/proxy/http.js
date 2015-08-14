var needle = require( 'needle' );
var version = require( '../../package' ).version;

module.exports = function( options ){
  if( !options ) options = {};
  if( !options.store ) options.store = ( require( '../storage/null' ) )();
  var cookie = "";

  // Load a cookie if need
  if(options.cookie) {
    cookie = options.cookie;
  }

  return function( uri, cb ){
    var hit = options.store.get( uri );
    if( hit ) return cb.apply( null, hit );
    var headers = {
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
      "Referer": uri,
      "Cookie": ""
    }
    needle.get(uri,{headers: headers, compressed: true}, function (error, res) {
      // console.log(error, res, body);
      if( error ) return cb( error, { uri: uri } );
      var result = [ error, {
        uri: uri,
        statusCode: res.status,
        headers: res.header,
        body: res.body || ''
      } ];

      options.store.set( uri, result );
      return cb.apply( null, result );
    });
  };
};
