const express = require('express');
const router = express.Router();
const CourseCrawler = require('../util/courseCraler');

/* GET course page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        let courses  =req.query.c;
        let url = 'https://www.bcit.ca/study/courses/'+courses;
        try{
            let bcitPromise = await CourseCrawler({url});
            res.end(JSON.stringify(await Promise.resolve(bcitPromise)))
        }catch (e) {
            res.end(JSON.stringify())
        }
    })();
});

module.exports = router;