const _ = require('lodash');
const pupperteer = require('puppeteer');
const jsonfile = require('jsonfile')
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
            await page.setViewport({width: 1200, height: 1200});
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

                await page.waitFor(".dedefault select[name='inputVars']", {timeout: 2000}).catch(e => {
                    throw 'username or password is wrong'
                })
                console.log('signed in')

                await page.select(".dedefault select[name='inputVars']", data.term)
                let index = 1
                for (crn of data.crn) {
                    if (index <= 5) {
                        console.log('enter CRN' + index + ":" + data.crn)
                        await page.type(".dedefault:nth-child(" + index + ") input", crn);
                    }
                    index++
                }
                console.log('submit CRN')
                await page.click('input[type="submit"]')


                await page.waitFor('input[type="checkbox"]', {timeout: 2000}).catch(e => {
                    throw 'CRN is wrong'
                })
                console.log('click Checkbox to confirm')
                await page.evaluate(() => {
                    let elements = document.querySelectorAll('input[type="checkbox"]');
                    for (let element of elements)
                        element.click();
                });

                console.log('click register');
                await page.click('input[type="submit"]')

                await page.waitFor(2000)
                console.log('click continue');
                await page.click('input[type="submit"]')

                await page.waitFor(1000)
                await page.evaluate(() => {
                    let elements = document.querySelectorAll('input[type="checkbox"]');
                    for (let element of elements)
                        element.click();
                });
                console.log('click continue');
                await page.click('input[type="submit"]')


                await page.screenshot({path: 'digg.png', fullPage: true});
                // Save Session Cookies
                const cookiesObject = await page.cookies()
                // Write cookies to temp file to be used in other profile pages
                jsonfile.writeFile('test.json', cookiesObject, {spaces: 2},
                    function (err) {
                        if (err) {
                            console.log('The file could not be written.', err)
                        }
                        console.log('Session has been successfully saved')
                    })
                //Different situation
                //1: Approvals for Registration

                console.log(data)
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
module.exports = registerCrawler;