var tuio    = require('epictuio'),
    app     = require('express')(),
    server  = require('http').createServer(app),
    socket  = require('socket.io');

var _tuio = new tuio({
    oscPort: 3333,
    oscHost: "127.0.0.1"
});

var port = 8080;

server.listen(port, function () {
  console.log("Listening on " + port);
}); 

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var io = socket.listen(server);
io.enable("browser client minification");
io.enable("browser client etag");
io.enable("browser client gzip");
io.set("log level", 1);
io.set("transports", [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling"
]);

io.sockets.on("connection", function(socket){

    _tuio.on('2Dcur',function(msg){
        console.log(msg);
        socket.emit('tuio', msg);
    })

});

