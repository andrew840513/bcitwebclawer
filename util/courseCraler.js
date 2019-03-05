const _ = require('lodash');
const pupperteer = require('puppeteer');
const CourseCrawler = (options) =>{
    return new Promise( (resolve, reject)=>{
        let {url} = options;
        pupperteer.launch({headless: false}).then(async browser =>{
            const page = await  browser.newPage();
            await page.setViewport({width:1200, height: 800});
            await page.goto(url);
            let getLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.col-main section li a'))
                return links.map(name => name.getAttribute('data-name'))
            });
            await page.close();
            await browser.close();
            resolve()
        })
    }).catch(function (error) {
        reject(error)
    })
};

module.exports = CourseCrawler;