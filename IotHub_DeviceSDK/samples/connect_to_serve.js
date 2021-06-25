// IotHub_DeviceSDK/samples/connect_to_serve.js

require('dotenv').config()

const IotDevice = require("../sdk/lot_device");

// var device = new IotDevice()
var device = new IotDevice({
  productName: process.env.PRODUCT_NAME,
  deviceName: process.env.DEVICE_NAME,
  secret: process.env.SECRET,
});

device.on("online", function () {
    console.log("device is online")
    // device.disconnect()
})

device.on("offline", function () {
    console.log("device is offline")
})


device.connect()