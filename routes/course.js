const express = require('express');
const router = express.Router();
const CourseCrawler = require('../util/courseCraler');

/* GET course page. */
router.get('/', function(req, res, next) {
    (async ()=>{
        let url  =req.query.url;
        console.log(url);
        // let bcitPromise = await CourseCrawler({url});
        //await Promise.all(bcitPromise)
        console.log('test1');
        res.render('index', { title: url });

    })();
});

module.exports = router;