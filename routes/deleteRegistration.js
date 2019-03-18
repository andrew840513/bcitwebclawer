const express = require('express');
const router = express.Router();
const DeleteCrawler = require('../util/deleteRegistrationClawer');
/* GET course page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        try{
            let url = 'https://bss.bcit.ca/owa_prod/swsregs.p_payment'
            let bcitPromise = await DeleteCrawler({url});
            res.end(JSON.stringify(await Promise.resolve(bcitPromise)))
        }catch (e) {
            res.end(JSON.stringify())
        }
    })();
});

module.exports = router;