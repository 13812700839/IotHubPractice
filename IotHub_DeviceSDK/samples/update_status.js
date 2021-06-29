// IotHub_DeviceSDK/samples/update_status.js

require('dotenv').config()
var IotDevice = require('../sdk/lot_device')
var path = require('path')

var device = new IotDevice({
    productName: process.env.PRODUCT_NAME,
    deviceName: process.env.DEVICE_NAME,
    secret: process.env.SECRET,
    clientID: path.basename(__filename, '.js'),
    // storePath: `../tmp/${path.basename(__filename, '.js')}`
    storePath: '../tmp/'+path.basename(__filename, '.js')
})

device.on('online', function () {  
    console.log('device is online')
})

device.connect()
device.updateStatus({lights:'on'})