const express = require('express');
const router = express.Router();
const CourseCrawler = require('../util/courseCrawler');

/* GET course page. */
router.get('/:courses', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async ()=>{
        let {courses} = req.params
        let url = 'https://www.bcit.ca/study/courses/'+courses;
        try{
            let bcitPromise = await CourseCrawler({url});
            res.end(JSON.stringify(await Promise.resolve(bcitPromise)))
        }catch (e) {
            res.end(JSON.stringify({
                "status": "error",
                "error": e
            }))
        }
    })();
});

module.exports = router;