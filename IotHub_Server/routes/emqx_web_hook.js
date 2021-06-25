// IotHub_Server/routes/emqx_web_hook.js

var express = require('express')
var router = express.Router()

router.post("/", function (req, res) {
    console.log(req.body)
    res.status(200).send('ok')
})

module.exports = router