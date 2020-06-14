const puppeteer = require("puppeteer");
const profile = require("../store/profile.json");
const { paymentPage, tokenPage } = require("./pages.js");

const setTokenPage = (r) => {
  r.respond({
    status: 200,
    contentType: "text/html",
    body: tokenPage(profile.token),
  });
};

const setPaymentPage = (r, package) => {
  r.respond({
    status: 200,
    contentType: "text/html",
    body: paymentPage(package),
  });
};

const overrideVisibility = `
Object.defineProperty(window.document,'hidden',{get:function(){return false;},configurable:true});
Object.defineProperty(window.document,'visibilityState',{get:function(){return 'visible';},configurable:true});
window.document.dispatchEvent(new Event('visibilitychange'));
`;

const args = [
  `--disable-extensions-except=${__dirname}/coil-extension`,
  `--load-extension=${__dirname}/coil-extension`,
  `--disable-backgrounding-occluded-windows`,
  `--disable-renderer-backgrounding`,
  `--disable-background-timer-throttling`,
];

const monetize = async (monetizationPackages, timePerPage = 20000) => {
  // Check whether user has logged in
  if (profile.token) {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args,
    });
    let pages = await browser.pages();
    await pages[0].setRequestInterception(true);
    // Set token in localStorage
    pages[0].on("request", setTokenPage);
    await pages[0].goto("https://coil.com/");
    await pages[0].waitFor(500);
    await pages[0].setRequestInterception(false);
    let page = await browser.newPage();
    await pages[0].close();
    // Use token to login
    await page.goto("https://coil.com/login");
    console.log(
      "If you are not being redirected automatically from the login page, please use the login command again, token may have expired or malformed\n"
    );
    page.once("framenavigated", async () => {
      const oldPage = page;
      page = await browser.newPage();
      await oldPage.close();
      await page.setRequestInterception(true);

      // Send page with monetization info
      page.on("request", (r) => {
        setPaymentPage(r, monetizationPackages.packages);
      });

      // Exposing function to handle Event Listeners

      await page.exposeFunction("handleEventListener", (data) => {
        monetizationPackages.invokeEventListener(data);
      });

      browser.on("targetcreated", async (target) => {
        const page = await target.page();
        if (page) page.close();
      });

      await page.goto("https://payingwithcoil.com/");
      await page.evaluate(overrideVisibility);
    });
  } else {
    // User has not previously logged in
    console.log("Please Login first");
    process.exit();
  }
};

module.exports = monetize;
