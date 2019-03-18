const _ = require('lodash');
const pupperteer = require('puppeteer');
const jsonfile = require('jsonfile');
const fs = require('fs')
const deleteCrawler = (options) => {
    return new Promise((resolve, reject) => {
        let {url} = options;
        let {data} = options;
        pupperteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({width: 1200, height: 1200});
            console.log("1")
            try {
                console.log("2")
                    // If file exist load the cookies
                const cookiesArr = require(`.${'./test.json'}`)
                console.log("3")
                if (cookiesArr.length !== 0) {
                    console.log("4")
                    for (let cookie of cookiesArr) {
                        await page.setCookie(cookie)
                    }
                    console.log("5")
                    console.log('Session has been loaded in the browser')
                }
                console.log("6")
                await page.goto(url);
            } catch (e) {
                console.log(e);
                resolve({
                    "status": "error",
                    "message": e
                })
            }


            resolve('done')
        })
    }).catch(function (error) {
        reject(error)
    })
};
module.exports = deleteCrawler;