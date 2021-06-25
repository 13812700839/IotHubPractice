// IotHub_Server/models/device.js

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Connection = require('./connection')

const deviceSchema = new Schema({
    // ProductName
    product_name:{
        type: String,
        required: true
    },
    // DeviceName
    device_name:{
        type: String,
        required: true
    },
    // 接入 EMQ X 时用的 username
    broker_username: {
        type: String,
        required: true
    },
    // secret
    secret: {
        type: String,
        required: true
    }
})

// 定义 device.toJSONObject
deviceSchema.methods.toJSONObject = function() {
    return {
        product_name: this.product_name,
        device_name: this.device_name,
        secret: this.secret
    }
}

// connected
deviceSchema.statics.addConnection = function (event) {
    var username_arr = event.username.split("/")
    this.findOne({product_name: username_arr[0], device_name: username_arr[1]}, function (err, device) {
        if (err == null && device != null) {
            Connection.findOneAndUpdate({
                client_id: event.clientid,
                device: device._id
            }, {
                connected: true,
                client_id: event.clientid,
                Keepalive: event.keepalive,
                ipaddress: event.ipaddress,
                proto_ver: event.proto_ver,
                connected_at: event.connected_at,
                conn_ack: event.conn_ack,
                device:device._id
            }, {upsert: true, useFindAndModify: false, new: true}).exec()
        }
    })
}

// disconnect
deviceSchema.statics.removeConnection = function (event) {
    var username_arr = event.username.split("/")
    this.findOne({product_name: username_arr[0], device_name: username_arr[1]}, function (err, device) {
        if (err == null && device != null) {
            Connection.findOneAndUpdate({
                client_id: event.clientid,
                device: device._id
            }, {
                connected: false,
                disconnect_at: Math.floor(Date.now() / 1000)
            }, {useFindAndModify: false}).exec()
        }
    })
}

const Device = mongoose.model('devices', deviceSchema)

module.exports = Device