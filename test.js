var request = require('request');

// Disconnect after ten seconds
var lifetime = 10;

function connect(url) {
	var r = request(url);
	r.on('response', function() {

		setTimeout(function() {
			r.abort();
		}, lifetime * 1000);
	});
}

// Direct connection
console.log('Direct connection');
for( var i = 0; i < 100; ++i ) {
	connect('http://localhost:3000/api/Tests/change-stream');
}

setTimeout(function(){
	console.log('Direct connection done')
}, lifetime * 1000)

// After the direct connections have expired
setTimeout(function() {
	console.log('Forwarded connection')
	for( var i = 0; i < 100; ++i ) {
		connect('http://localhost:3010/api/Tests/change-stream');
	}
	
	setTimeout(function(){
		console.log('Forwarded connection done')
	}, lifetime * 1000)

}, lifetime * 1000 * 2);