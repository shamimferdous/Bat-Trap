const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const puppeteer = require('puppeteer');

//body parser middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//setting static file serving folder
app.use(express.static('public'));


//setting view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//index route
app.get('/', (req, res)=>{
    res.render('landing', {layout: false});
})


//trap pdf route
app.post('/trap-pdf', (req, res)=>{
    //console.log(req.body.pageURL);
    console.log('Triggered');

    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        // await page.setViewport({
        //   width: 1920,
        //   height: 1080,
        //   deviceScaleFactor: 1,
        // });
        await page.goto(req.body.pageURL, {waitUntil: 'networkidle2'});
        let pageHeight = await page.evaluate(() => document.documentElement.offsetHeight);

        console.log(pageHeight);
        
        const pdf = await page.pdf({path: 'hello.pdf', printBackground: true, width: '1366 px', height: `${pageHeight} px`,});
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
      
        await browser.close();

      })();
});



//firing server
app.listen(6900, ()=>{
    console.log('Server fired on port 6900...');
});