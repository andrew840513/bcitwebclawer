const express = require('express');
const router = express.Router();
const BCIT_Crawler = require('../util/bcitCrawler');
const BCIT_GetAllCourses = require('../util/getCoursesFromProgram');
const _ = require('lodash');
let courseJ = require('./courseJ');
let program = require('./pogram');
let result = require('./result');
let meow = require('./cat');
const pLimit = require('p-limit');
let limit = pLimit(1);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  (async ()=>{
    try {
      // let url = 'https://www.bcit.ca/study/courses/list?s%5B0%5D=';
      // let bcitPromise = await BCIT_Crawler({url});

      res.end(JSON.stringify(courseJ));
    }catch (e) {
      res.end(JSON.stringify({
        "status": "error",
        "error": e
      }))
    }

  })();
});

router.get('/category', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  (async ()=>{
    try {
      let category = result.map(a =>a.cat)
      res.end(JSON.stringify(_.uniq(category)));
    }catch (e) {
      res.end(JSON.stringify({
        "status": "error",
        "error": e
      }))
    }

  })();
});

router.get('/c', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // program = _.chunk(program,1)[0];
  (async ()=>{
    try {
      let menuPromise  = _.map(program, function (v) {
        console.log(v.link)
        return limit(() => BCIT_GetAllCourses(v.link))
      })
      await Promise.all(menuPromise)
      res.end(JSON.stringify(''));
    }catch (e) {
      res.end(JSON.stringify({
        "status": "error",
        "error": e
      }))
    }

  })();
});

router.get('/d', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // program = _.chunk(program,1)[0];
  (async ()=>{
    try {
      res.end(JSON.stringify(_.sortBy(_.uniqBy(courseJ,'link'), "cat")));
    }catch (e) {
      res.end(JSON.stringify({
        "status": "error",
        "error": e
      }))
    }

  })();
});

router.get('/e', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // program = _.chunk(program,1)[0];
  (async ()=>{
    try {
      obj = []
      courseJ = _.map(courseJ,(course)=>{
        let catInital = course.link.substr(0,4)
        obj.push({i:catInital,cat:course.cat})
      })
      res.end(JSON.stringify(_.uniqBy(obj,'i')));
    }catch (e) {
      res.end(JSON.stringify({
        "status": "error",
        "error": e
      }))
    }

  })();
});

router.get('/f', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  (async ()=>{
    let obj = [];
    _.map(result, (course)=>{
      let cat = _.find(meow, ['i', course.link.substr(0,4)]);
      if(cat){
        course['cat'] = cat.cat;
      }
      obj.push(course)
    })
    res.end(JSON.stringify(obj));

  })();
});


router.get('/g', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  (async ()=>{
    let obj = [];
    _.map(result, (course)=>{
      let name = _.find(courseJ, ['name', course.name]);
      console.log(name);
      if(!name){
        obj.push(course)
      }
    })
    res.end(JSON.stringify(_.sortBy(obj,'cat')));

  })();
});
module.exports = router;