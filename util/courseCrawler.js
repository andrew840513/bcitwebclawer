const _ = require('lodash');
const pupperteer = require('puppeteer');
const async = require('async');
const CourseCrawler = (options) => {
    return new Promise((resolve, reject) => {
        let {url} = options;
        pupperteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({width: 1200, height: 800});
            await page.goto(url);
            await page.waitFor(50)
            await page.addScriptTag({url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"});
            let getLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('#course_sections section.crse-term'));
                const courseName = document.querySelector('#course_name').textContent;
                // let termsID = links.map(term => term.getAttribute('id'));
                let ojb = []
                 _.map(links, (link) => {
                    let term = link.getAttribute('id');
                    let crns = link.querySelectorAll('article.sctn h1 span');
                    let courseDetail = link.querySelectorAll('.sctn-meets tbody td');
                    let instructor = link.querySelectorAll('.sctn-instructor p');
                    let duration = link.querySelectorAll('.sctn-duration p span');
                    let cost = link.querySelectorAll('.sctn-cost p');
                    let status = link.querySelectorAll('.sctn-status p.sctn-status-lbl')
                    let courseDetailIndex = 0;
                    let index = 0;
                    _.map(crns, (crn) => {

                        let tempObj = {
                            courseName,
                            term,
                            'crn':crn.textContent,
                            'duration':duration[index].textContent,
                            'date':courseDetail[courseDetailIndex].textContent,
                            'day':courseDetail[1+courseDetailIndex].textContent,
                            'time':courseDetail[2+courseDetailIndex].textContent,
                            'location':courseDetail[3+courseDetailIndex].textContent.replace(/(\r\n|\n|\r)/gm, "")
                                .replace(/( +)/gm, " ").trim(),
                            'instructor':instructor[index].textContent,
                            'cost':cost[index].textContent,
                            'status':(status[index] != undefined)? status[index].textContent : ""

                        };
                        courseDetailIndex+=4;
                        index++;
                        ojb.push(tempObj)
                    });
                })
                return ojb
            });
            await page.close();
            await browser.close();
            resolve(getLink)
        })
    }).catch(function (error) {
        reject(error)
    })
};

module.exports = CourseCrawler;