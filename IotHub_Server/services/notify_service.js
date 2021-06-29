// IotHub_Server/services/notify_service.js

require('dotenv').config()
var amqp = require('amqplib/callback_api')
const bson = require('bson')

var uploadDataExchange = 'iothub.events.upload_data'
var currentChannel = null

// 初始化RabbitMQ客户端
amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {  
    if (error0) console.log(error0)
    else {
        connection.createChannel(function (error1, channel) {  
            if (error1) console.log(error1)
            else {
                currentChannel = channel
                channel.assertExchange(uploadDataExchange, 'direct', {durable: true})
            }
        })
    }
})

class NotifyService {
    static notifyUploadData(message) {
        var data = bson.serialize({
            device_name: message.device_name,
            payload: message.payload,
            sent_at: message.sent_at,
            data_type:message.data_type,
            message_id: message.message_id
        })
        if (currentChannel != null) currentChannel.publish(uploadDataExchange, message.product_name, data, {
            persistent: true
        })
    }
}

module.exports = NotifyService