const _ = require('lodash');
const pupperteer = require('puppeteer');
const registerCrawler = (options) => {
    return new Promise((resolve, reject) => {
        let {url} = options;
        let {data} = options;
        pupperteer.launch({
            headless: true,
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
                        console.log('Quick Registration: enter CRN' + index + ":" + crn)
                        await page.type(".dedefault:nth-child(" + index + ") input", crn);
                    }
                    index++
                }
                console.log('Quick Registration: submit CRN')
                await page.click('input[type="submit"]')


                await page.waitFor('input[type="checkbox"]', {timeout: 2000}).catch(e => {
                    throw 'CRN is wrong'
                })
                console.log('Quick Registration: click Checkbox to confirm')
                await page.evaluate(() => {
                    let elements = document.querySelectorAll('input[type="checkbox"]');
                    for (let element of elements)
                        element.click();
                });

                console.log('Quick Registration: click register');
                await page.click('input[type="submit"]')
                await page.waitFor(2000)
                console.log('check if at detail page')
                if (await page.evaluate(() => document.querySelector('td.pldefault h2').innerText) === "Approvals for Registration") {
                    console.log('Approvals for Registration: need department approvals, click continue')
                    await page.click('input[type="submit"]')
                    await page.waitFor(2000)
                }
                await page.addScriptTag({url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"});
                let getLink = {};
                console.log('Registration Status: checking error')
                if (await page.$('.datadisplaytable[summary="This layout table is used to present Registration Errors."]') !== null) {
                    console.log('Registration Status: found error')
                    let result = await page.evaluate(() => {
                        let elements = Array.from(document.querySelectorAll('.datadisplaytable[summary="This layout table is used to present Registration Errors."] tbody tr:not(:first-child)'))
                        let obj = [];
                        _.map(elements, (element)=>{
                            let s = Array.from(element.querySelectorAll('td'));
                            let status = s[0].textContent;
                            let crn = s[1].textContent;
                            let course = s[2].textContent+" "+s[3].textContent
                            let temp = {
                                status,
                                crn,
                                course
                            }
                            obj.push(temp)
                        })
                        return obj
                    });
                    console.log('Registration Status: generate error result')
                    getLink['error'] = result;
                }

                console.log('Registration Status: click continue');
                await page.click('input[type="submit"]')

                await page.waitFor(2000)
                console.log('Privacy Statement: click checkbox')
                await page.evaluate(() => {
                    let elements = document.querySelectorAll('input[type="checkbox"]');
                    for (let element of elements)
                        element.click();
                });
                console.log('Privacy Statement: click continue')
                await page.click('input[type="submit"]')

                console.log('View tuition: displayed')
                getLink['status'] = "success"
                console.log('end registration')
                page.close()
                browser.close()
                resolve(getLink)
            } catch (e) {
                console.log(e);
                resolve({
                    "status": "error",
                    "error": e
                })
            }


            resolve('done')
        })
    }).catch(function (error) {
        reject(error)
    })
};
module.exports = registerCrawler;