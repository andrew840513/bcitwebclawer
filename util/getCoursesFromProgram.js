const _ = require('lodash');
const pupperteer = require('puppeteer');
const fs = require('fs')
const BCIT_GetAllCourses = (options) => {
    return new Promise((resolve, reject) => {
        pupperteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({width: 1200, height: 800});
            console.log(options);
            await page.goto(options);
            await page.addScriptTag({url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"});
            let getLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('#programmatrix tbody tr'));
                let obj = []

                _.map(links, (linkk) => {
                    let name = linkk.querySelector('td.course_number > a')
                    let link = linkk.querySelector('.course_number>a')

                    let credit = linkk.querySelector('.credits')
                    if (name && link && credit) {
                        name = name.getAttribute('data-name')
                        link = link.href.substr(link.href.length - 8, link.href.length)
                        credit = credit.textContent
                        obj.push({name, link, credit})
                    }


                })
                return obj;
            });
            await page.close();
            await browser.close();
            fs.appendFile('result.json', JSON.stringify(getLink, null, 4).replace('[', '').replace(']', ','), function (error) {
                if (error) throw error
            })
            resolve('done')
        })
    }).catch(function (error) {
        console.log(error)
        reject(error)
    })
};

module.exports = BCIT_GetAllCourses;