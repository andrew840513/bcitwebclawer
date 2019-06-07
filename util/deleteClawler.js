const testCrawler = (options) => {
    return new Promise(async (resolve, reject) => {
        let {page} = options
        let {browser} = options
        try {
            if(await page.evaluate(() => document.querySelector('input[value="Delete current registration'))){
                await page.click('input[value="Delete current registration"]')
                console.log("deleting course")

                await page.waitFor('input[value="Confirm to drop the above registration(s)"]', {timeout: 2000}).catch(e => {
                    throw "page not exist"
                })
                await page.click('input[value="Confirm to drop the above registration(s)"]')
                console.log("delete course")

                await page.waitFor('span.infotext', {timeout: 2000}).catch(e => {
                    throw "can't find confirm"
                })
                console.log("success")
            }else{
                console.log("nothing to delete")
            }
            await page.close()
            await browser.close()
            resolve("success")
        } catch (e) {
            console.log(e);
            page.close()
            browser.close()
            resolve({
                "status": "error",
                "error": e
            })
        }


        resolve('done')
    })
};
module.exports = testCrawler;