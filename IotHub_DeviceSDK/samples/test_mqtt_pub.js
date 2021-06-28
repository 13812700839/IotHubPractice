// IotHub_DeviceSDK/samples/test_mqtt_pub.js

var mqtt = require('mqtt')
require('dotenv').config()

var client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.PRODUCT_NAME+'_'+process.env.DEVICE_NAME,
    password: process.env.SECRET
})

client.on('connect', function (connack) {  
    console.log('retrun code: '+connack.returnCode) 
    client.publish("/topic1", "test", console.log)
})