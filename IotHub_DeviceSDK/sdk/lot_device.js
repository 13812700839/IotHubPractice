// lot_device.js
"use script";
var mqtt = require('mqtt')
const EventEmitter = require('events');

class IotDevice extends EventEmitter {
    // constructor({serverAddress = "127.0.0.1:8883", productName, deviceName, secret} = {}) {
    constructor({serverAddress = "10.40.250.101:8883", productName, deviceName, secret} = {}) {
        super();
        // this.serverAddress = `mqtt://${serverAddress}`
        // this.serverAddress = 'mqtt://'+serverAddress
        this.serverAddress = 'mqtts://'+serverAddress
        this.productName = productName
        this.deviceName = deviceName
        this.secret = secret
        // this.username = `${this.productName}/${this.deviceName}`
        this.username = this.productName+'/'+this.deviceName
    }

    connect() {
        this.client = mqtt.connect(this.serverAddress, {
            rejectUnauthorized: false,
            username: this.username,
            password: this.secret
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