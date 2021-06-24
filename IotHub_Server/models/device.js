// IotHub_Server/models/device.js

var mongoose = require('mongoose')
var Schema = mongoose.Schema

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

module.exports = mongoose.model('devices', deviceSchema)