const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const RegisterCrawler = require('../util/testing');
/* GET course page. */


router.post('/register', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    (async () => {
        try {
            let data = req.body
            let url = 'https://bss.bcit.ca/owa_prod/twbkwbis.P_WWWLogin?ret_code=E'
            let bcitPromise = await RegisterCrawler({url, data});
            res.send(JSON.stringify(await Promise.resolve(bcitPromise)))
        } catch (e) {
            res.end(JSON.stringify({
                "status": "error",
                "error": e
            }))
        }
    })();
});

router.post('/delete', function (req, res, next) {
    (async () => {
        res.send("success")
    })()
});


//TESTING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const pages = new Map();
(async () => {

    router.post('/testregister', async function (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        let data = req.body
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        })
        const page = await browser.newPage()
        let bcitPromise = await RegisterCrawler({data, page});
        pages.set(data.userid, browser)
        res.send(JSON.stringify(await Promise.resolve(bcitPromise)))

    });

    router.post('/testdelete', async function (req, res, next) {
        let data = req.body
        const browser = await pages.get(data.userid)

        if(!browser) {
            res.send("success")
        }else{
            const page = await (await browser.pages())[1]
            await page.close()
            //await browser.close()
            res.send("success")
        }

    });
})();
module.exports = router;