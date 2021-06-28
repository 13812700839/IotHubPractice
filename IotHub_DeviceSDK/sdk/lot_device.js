// lot_device.js
"use strict";
var mqtt = require('mqtt')
const EventEmitter = require('events');

class IotDevice extends EventEmitter {
    // constructor({serverAddress = "127.0.0.1:8883", productName, deviceName, secret, clientID} = {}) {
    constructor({serverAddress = "10.40.250.101:8883", productName, deviceName, secret, clientID} = {}) {
        super();
        // this.serverAddress = `mqtt://${serverAddress}`
        // this.serverAddress = 'mqtt://'+serverAddress
        this.serverAddress = 'mqtts://'+serverAddress
        this.productName = productName
        this.deviceName = deviceName
        this.secret = secret
        // this.username = `${this.productName}/${this.deviceName}`
        this.username = this.productName+'_'+this.deviceName
        // 根据ClientID设置
        // if (clientID!=null) this.clientIdentifier = `${this.username}/${clientID}`
        if (clientID!=null) this.clientIdentifier = this.username+'_'+clientID
        else this.clientIdentifier = this.username
    }

    connect() {
        this.client = mqtt.connect(this.serverAddress, {
            rejectUnauthorized: false,
            username: this.username,
            password: this.secret,
            // 设置ClientID 和 clean session
            clientId: this.clientIdentifier,
            clean: false
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