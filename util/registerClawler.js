const _ = require('lodash');
const pupperteer = require('puppeteer');
const registerCrawler = (options) => {
    return new Promise((resolve, reject) => {
        let {url} = options;
        let {data} = options;
        pupperteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({width: 1200, height: 800});
            await page.goto(url);
            try {

                await page.waitFor('#userid', {timeout: 2000}).catch(e => {
                    throw "can't find username field"
                })
                await page.type("#userid", data.userid);
                await page.waitFor('#pwd', {timeout: 2000}).catch(e => {
                    throw "can't find password field"
                })
                await page.type("#pwd", data.pwd);
                await page.click('#button_sign-in')
                console.log('sign in')
                await page.screenshot({path: 'digg.png', fullPage: true});
                await page.waitFor(".dedefault select[name='inputVars']", {timeout: 2000}).catch(e => {
                    throw 'username or password is wrong'
                })
                console.log('signed in')
                await page.select(".dedefault select[name='inputVars']", data.term)
                let index = 1
                for (crn of data.crn) {
                    if (index <= 5) {
                        await page.type(".dedefault:nth-child(" + index + ") input", crn);
                    }
                    index++
                }
                await page.click('input[type="submit"]')
                await page.waitFor('input[type="checkbox"]', {timeout: 2000}).catch(e => {
                    throw 'username or password is wrong'
                })

                await page.evaluate(() => {
                    let elements = document.querySelectorAll('input[type="checkbox"]');
                    for (let element of elements)
                        element.click();
                });
                console.log(data)
            } catch (e) {
                console.log(e)
            }


            resolve('done')
        })
    }).catch(function (error) {
        reject(error)
    })
};

module.exports = registerCrawler;