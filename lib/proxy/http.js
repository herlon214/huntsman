var request = require( 'request' );
// var request = request.defaults({'proxy':'http://52.64.29.204:80/', tunnel: false})
var version = require( '../../package' ).version;

//https://54.146.40.187:80/

module.exports = function( options ){
  if( !options ) options = {};
  if( !options.store ) options.store = ( require( '../storage/null' ) )();
  return function( uri, cb ){
    var hit = options.store.get( uri );
    if( hit ) return cb.apply( null, hit );
    request(uri, function (error, res, body) {
      // console.log(error, res, body);
      if( error ) return cb( error, { uri: uri } );
      var result = [ error, {
        uri: uri,
        statusCode: res.status,
        headers: res.header,
        body: body || ''
      } ];

      options.store.set( uri, result );
      return cb.apply( null, result );
    });
  };
};
