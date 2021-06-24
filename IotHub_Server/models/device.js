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

// 定义 device.toJSONObject
deviceSchema.methods.toJSONObject = function() {
    return {
        product_name: this.product_name,
        device_name: this.device_name,
        secret: this.secret
    }
}

module.exports = mongoose.model('devices', deviceSchema)