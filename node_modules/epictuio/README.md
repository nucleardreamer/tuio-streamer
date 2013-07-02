epic-tuio
=========

a simple udp osc parser that returns an event emitter

usage
--------

	var tuio = require('epictuio');

	// creates an instance, returns an event emitter
	var _tuio = new tuio({
	    oscPort: 3333,			// default TUIO port
	    oscHost: "127.0.0.1",		// your machine
	    raw: false 				// not required
	});

	// example of a 2D cursor being sent via TUIO to this server
	_tuio.on('2Dcur', function(msg){
	  	console.log(msg);
	})