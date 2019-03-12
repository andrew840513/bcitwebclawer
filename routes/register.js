const express = require('express');
const router = express.Router();
const RegisterCrawler = require('../util/registerClawler');
/* GET course page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        try{
            let data = {
                'userid': 'A00850536',
                'pwd'   : 'Frank00567',
                'term'  : '201920',
                'crn'   : ['62904']
            }
            let url = 'https://bss.bcit.ca/owa_prod/twbkwbis.P_WWWLogin?ret_code=E'
            let bcitPromise = await RegisterCrawler({url, data});
            res.end(JSON.stringify(await Promise.resolve(bcitPromise)))
        }catch (e) {
            res.end(JSON.stringify())
        }
    })();
});

module.exports = router;