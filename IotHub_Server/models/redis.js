// IotHub_Server/models/redis.js
// 建立Redis数据库的连接

require('dotenv').config()
const redis = require('redis')

const opts = {
	auth_pass: "123456",
}
const client = redis.createClient(process.env.REDIS_URL, opts)
client.on('error', function (err) {  
    console.log('Error '+err)
})

module.exports = client