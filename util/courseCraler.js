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
            await page.addScriptTag({ url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js" });
            let getLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('#course_sections section.crse-term'));
                const courseName = document.querySelector('#course_name');
                let termsID = links.map(term => term.getAttribute('id'));

                // let result = {}
                // let index = 0;
                //
                // for(link of links){
                //     var temp = []
                //     for(crn of link.querySelectorAll('article.sctn h1 span')){
                //         temp.push(crn.textContent);
                //     }
                //     result[termsID[index]] = {CRN:temp}
                //     index++;
                // }
                //
                // result['CourseName'] = courseName.textContent;
                return _.map(links, (link)=>{
                    let crns = link.querySelectorAll('article.sctn h1 span');
                    _.map(crns, (crn)=>{
                        console.log(crn.textContent)
                    })
                    return {}
                })
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