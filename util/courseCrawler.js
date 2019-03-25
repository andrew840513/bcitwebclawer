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
                let termsID = links.map(term => term.getAttribute('id'));
                let ojb = []
                _.map(links, (link) => {
                    let sections = Array.from(link.querySelectorAll('.sctn'))
                    _.map(sections,(section)=>{
                        let term = link.getAttribute('id')
                        let crn = section.querySelector('h1 span').textContent
                        let instructor = section.querySelector('.sctn-instructor p').textContent
                        let duration = section.querySelector('.sctn-duration p span').textContent
                        let cost = section.querySelector('.sctn-cost p').textContent
                        let status = (section.querySelector('.sctn-status p.sctn-status-lbl') != undefined) ? section.querySelector('.sctn-status p.sctn-status-lbl').textContent : ""
                        let meets = Array.from(section.querySelectorAll('.sctn-meets table tbody tr'))
                        let date = []
                        let day = []
                        let time = []
                        let location = []
                        _.map(meets,(meet)=>{
                            let a  = Array.from(meet.querySelectorAll('td'))
                            date.push(a[0].textContent)
                            day.push(a[1].textContent)
                            time.push(a[2].textContent)
                            location.push(a[3].textContent.replace(/(\r\n|\n|\r)/gm, "")
                                .replace(/( +)/gm, " ").trim())
                        })
                        let tempObj = {
                            courseName,
                            term,
                            crn,
                            duration,
                            date,
                            day,
                            time,
                            location,
                            instructor,
                            cost,
                            status
                        }
                        ojb.push(tempObj)
                    })
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