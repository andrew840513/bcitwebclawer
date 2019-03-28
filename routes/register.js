const express = require('express');
const router = express.Router();
const RegisterCrawler = require('../util/registerClawler');
/* GET course page. */
router.post('/', function(req, res, next) {
    // res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        try{
            data = req.body
            data = JSON.parse(Object.keys(data)[0])
            let url = 'https://bss.bcit.ca/owa_prod/twbkwbis.P_WWWLogin?ret_code=E'
            let bcitPromise = await RegisterCrawler({url, data});
            res.send(JSON.stringify(await Promise.resolve(bcitPromise)))
        }catch (e) {
            res.end(JSON.stringify())
        }
    })();
});

module.exports = router;