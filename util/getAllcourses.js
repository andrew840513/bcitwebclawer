const _ = require('lodash');
const pupperteer = require('puppeteer');
const BCIT_GetAllCourses = (options) =>{
    return new Promise( (resolve, reject)=>{
        let {url} = options;
        pupperteer.launch({headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox'],dumpio: true}).then(async browser =>{
            const page = await  browser.newPage();
            await page.setViewport({width:1200, height: 800});
            await page.goto(url);
            let getLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('#sector_program_listing ol li a'));
                const link = Array.from(document.querySelectorAll('#sector_program_listing h2'));
                return {name: links.map(name => name.getAttribute('data-name')),
                    link: links.map(link => link.href+'#courses')}
            });
            let newBcitCourse = []
            for(let i = 0; i < getLink.name.length; i++){
                let obj = {name: getLink.name[i], link: getLink.link[i]}
                newBcitCourse.push(obj)
            }
            await page.close();
            await browser.close();
            resolve(newBcitCourse)
        })
    }).catch(function (error) {
        reject(error)
    })
};

module.exports = BCIT_GetAllCourses;