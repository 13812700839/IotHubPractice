// lot_device.js
"use script";
var mqtt = require('mqtt')
const EventEmitter = require('events');

class IotDevice extends EventEmitter {
    constructor(serverAddress = "127.0.0.1:8883") {
        super();
        // this.serverAddress = `mqtt://${serverAddress}`
        this.serverAddress = 'mqtt://'+serverAddress
    }

    connect() {
        this.client = mqtt.connect(this.serverAddress, {
            rejectUnauthorized: false
        })
        var self = this
        this.client.on("connect", function () {
            self.emit("online")
        })
        this.client.on("offline", function () {
            self.emit("offline")
        })
        this.client.on("error", function (err) {
            self.emit("error", err)
        })

    }

    disconnect() {
        if (this.client != null) {
            this.client.end()
        }
    }

}

module.exports = IotDevice;