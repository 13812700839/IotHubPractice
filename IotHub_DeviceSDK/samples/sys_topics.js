// IotHub_DeviceSDK/samples/sys_topics.js

require('dotenv').config()

var mqtt = require("mqtt");
var jwt = require("jsonwebtoken");

var password = jwt.sign(
  {
    username: "jwt_user",
    exp: Math.floor(Date.now() / 1000) + 10
  },
  process.env.JWT_SECRET
);

var client = mqtt.connect(process.env.MQTT_URL, {
  username: "jwt_user",
  password: password
});

client.on("connect", function () {
  console.log("connected");
  client.subscribe("$SYS/brokers/+/+/clients/+/connected");
  client.subscribe("$SYS/brokers/+/+/clients/+/disconnected");
});

client.on("message", function (_, message) {
    console.log(message.toString())
});