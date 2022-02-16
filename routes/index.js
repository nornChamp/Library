const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {  //get route from html /
    res.render('index')
}) 


module.exports = router