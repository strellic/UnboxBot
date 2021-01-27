const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://convars.com/case/en', { waitUntil: "networkidle2" });
    await page.waitFor(5.5 * 1000);
    await page.goto(url);

    await page.evaluate(() => {
        console.log(document.body.innerHTML);
    });

    await page.close();
    await browser.close();
})();
