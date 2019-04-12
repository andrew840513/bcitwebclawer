const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const RegisterCrawler = require('../util/registerClawler');
const DeleteCrawler = require('../util/deleteClawler');
const pages = new Map();

async function closeTask(page, browser, userid) {
    if(!browser) {
        console.log("already closed")
    }else {
        await DeleteCrawler({page,browser})
        pages.delete(userid)
    }

}

(async () => {

    router.post('/register', async function (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        let data = req.body
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        })
        const page = await browser.newPage()
        let id = uniqid.process(data.userid+"-");
        let bcitPromise = await RegisterCrawler({data, page, id});
        pages.set(id, browser)
        setTimeout(() => closeTask(page, browser, id), 30 * 60 * 1000);
        res.send(JSON.stringify(await Promise.resolve(bcitPromise)))
    });

    router.post('/delete', async function (req, res, next) {
        let data = req.body
        const browser = await pages.get(data.userid)

        if(!browser) {
            console.log("already closed")
            res.send("success")
        }else{
            const page = await (await browser.pages())[1]
            let deleteRegistrationPromist = await DeleteCrawler({page,browser})
            pages.delete(data.userid)
            res.send(JSON.stringify(await Promise.resolve(deleteRegistrationPromist)))
        }

    })
})();
module.exports = router;