const puppeteer = require("puppeteer");
const profile = require("../store/profile.json");

const setTokenPage = (r) => {
  r.respond({
    status: 200,
    contentType: "text/html",
    body: `
  <html>
    <title>Test</title>
    <script>
        localStorage.setItem('token','${profile.token}')
    </script>
  </html>
  <body>
  <h1>
        Setting JWT
  </h1>
  </body>
  `,
  });
};

const setPaymentPage = (r, wallets, current) => {
  r.respond({
    status: 200,
    contentType: "text/html",
    body: `
  <html>
    <title>Test</title>
    <meta name="monetization" content="${wallets[current].webMonetization.wallet}">
  </html>
  <body>
  <h1>
        Currently Paying to ${wallets[current].name}
  </h1>
  </body>
  `,
  });
};

const overrideVisibility = `
Object.defineProperty(window.document,'hidden',{get:function(){return false;},configurable:true});
Object.defineProperty(window.document,'visibilityState',{get:function(){return 'visible';},configurable:true});
window.document.dispatchEvent(new Event('visibilitychange'));
`;

let current = 0;

const monetize = async (wallets) => {
  if (profile.token) {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        `--disable-extensions-except=${__dirname}/coil-extension`,
        `--load-extension=${__dirname}/coil-extension`,
        `--disable-backgrounding-occluded-windows`,
        `--disable-renderer-backgrounding`,
        `--disable-background-timer-throttling`,
      ],
    });
    const pages = await browser.pages();
    await pages[0].setRequestInterception(true);
    pages[0].on("request", setTokenPage);
    await pages[0].goto("https://coil.com/");
    await pages[0].waitFor(500);
    await pages[0].setRequestInterception(false);
    let page = await browser.newPage();
    await pages[0].close();
    await page.goto("https://coil.com/login");
    page.once("framenavigated", async () => {
      let oldPage = page;
      while (1) {
        page = await browser.newPage({ selected: false });
        await oldPage.close();
        oldPage = page;
        await page.setRequestInterception(true);
        page.on("request", (r) => {
          setPaymentPage(r, wallets, current);
        });
        await page.goto("https://example.com/");
        await page.evaluate(overrideVisibility);
        current = (current + 1) % wallets.length;
        await page.waitFor(20000);
        await page.setRequestInterception(false);
      }
    });
  } else {
    console.log("Please Login first");
  }
};

module.exports = monetize;
