var needle = require( 'needle' );
// var j = request.jar();
// var rarbgCookie = request.cookie('7fAY799j=VtdTzG69');
// var request = request.defaults({'proxy':'http://52.64.29.204:80/', tunnel: false})
var version = require( '../../package' ).version;

//https://54.146.40.187:80/

module.exports = function( options ){
  if( !options ) options = {};
  if( !options.store ) options.store = ( require( '../storage/null' ) )();
  return function( uri, cb ){
    var hit = options.store.get( uri );
    if( hit ) return cb.apply( null, hit );
    var headers = {
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
      "Referer": uri,
      "Cookie": "7fAY799j=VtdTzG69; __utma=9515318.478818894.1439417977.1439421071.1439426165.3; __utmz=9515318.1439417977.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmc=9515318; LastVisit=1439426317; __utmb=9515318.3.10.1439426165; __utmt=1"
    }
    needle.request('get', uri, {},{headers: headers, compressed: true}, function (error, res) {
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
