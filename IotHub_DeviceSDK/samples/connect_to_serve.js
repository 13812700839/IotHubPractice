const IotDevice = require("../sdk/lot_device");

// var device = new IotDevice()
var device = new IotDevice({productName:"IotApp",deviceName:"ERLIUnPDQ",secret:"IQMo6ZgxdW"})

console.log(device)


device.on("online", function () {
    console.log("device is online")
    device.disconnect()
})

device.on("offline", function () {
    console.log("device is offline")
})


device.connect()