const express = require('express');
const router = express.Router();
const CourseCrawler = require('../util/courseCraler');

/* GET course page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        // let url  =req.query.url;
        let url = 'https://www.bcit.ca/study/courses/comp3704';
        let bcitPromise = await CourseCrawler({url});
        res.end(JSON.stringify(await Promise.resolve(bcitPromise)));

    })();
});

module.exports = router;