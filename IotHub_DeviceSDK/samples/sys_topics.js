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

var client = mqtt.connect("mqtt://10.40.250.101:1883", {
  username: "jwt_user",
  password: password,
});

client.on("connect", function () {
  console.log("connected");
  client.subscribe("$SYS/brokers/+/+/clients/+/connected");
  client.subscribe("$SYS/brokers/+/+/clients/+/disconnected");
});

client.on("message", function (_, message) {
    console.log(message.toString())
});