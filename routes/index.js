const express = require('express');
const router = express.Router();
const BCIT_Crawler = require('../util/bcitCrawler');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  (async ()=>{
    let url = 'https://www.bcit.ca/study/courses/list?s%5B0%5D=';
    let bcitPromise = await BCIT_Crawler({url});

    res.end(JSON.stringify(await Promise.all(bcitPromise)));
  })();
});
module.exports = router;