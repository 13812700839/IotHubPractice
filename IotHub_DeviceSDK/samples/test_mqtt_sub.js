// IotHub_DeviceSDK/samples/test_mqtt_sub.js

var jwt = require('jsonwebtoken')
var mqtt = require('mqtt')
require('dotenv').config()

var username = 'username'
var password = jwt.sign({
    username: username,
    exp: Math.floor(Date.now() / 1000)+10
}, process.env.JWT_SECRET)

var client = mqtt.connect(process.env.MQTT_URL, {
    username: username,
    password: password
})

client.on('connect', function (connack) { 
    console.log('return code: '+connack.returnCode)
    client.subscribe('/topic1')
})

client.on('message', function (_, message) {  
    console.log(message.toString())
})