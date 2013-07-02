var server = function(params, cb){
    this.dgram = require("dgram");
    this.events = require("events");
    this.emitter = new this.events.EventEmitter();
    this.udpSocket = null;
    this.oscParser = require("./oscParser");
    this.init(params);

    return this.emitter;
}

server.prototype.init = function(params) {
    var _this = this;
    _this.udpSocket = _this.dgram.createSocket("udp4");

    _this.udpSocket.bind(params.oscPort, params.oscHost);
    if(!params.raw){
        _this.udpSocket.on("message", function(msg) {
            var bundle = {};
            var bundleData = _this.oscParser.decode(msg);
            if(bundleData[0] == '#bundle'){
                switch(bundleData[2][0].split('/')[2]){
                    case "2Dcur":
                        bundle.type = "2Dcur";
                        bundleData.forEach(function(e,i,a){
                            switch(e[1]){
                                case "alive":
                                    bundle.alive = e[2] || 'null';
                                    break;
                                case "set":
                                    bundle.data = _this.parse2dCursor(e);
                                    break;
                                case "fseq":
                                    bundle.fseq = e[2];
                                    break;
                            }
                        });
                        _this.emitter.emit(bundle.type, bundle);
                        break;
                }
            }
        });
    } else {
        _this.udpSocket.on("message", function(msg) {
            _this.emitter.emit('raw', _this.oscParser.decode(msg));
        });
    }
};

server.prototype.parse2dCursor = function() {
    var args = arguments[0];
    var data = {
        sid: args[2],
        x: args[3],
        y: args[4],
        vx: args[5],
        vy: args[6],
        motion: args[7]
    };
    return data;
};

module.exports = server;