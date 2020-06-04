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

const setPaymentPage = (r, package) => {
  r.respond({
    status: 200,
    contentType: "text/html",
    body: `
  <html>
    <title>Test</title>
    <meta name="monetization" content="${package.webMonetization.wallet}">
  </html>
  <body>
  <h1>
        Currently Paying to ${package.name}@${package.version}
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

const args = [
  `--disable-extensions-except=${__dirname}/coil-extension`,
  `--load-extension=${__dirname}/coil-extension`,
  `--disable-backgrounding-occluded-windows`,
  `--disable-renderer-backgrounding`,
  `--disable-background-timer-throttling`,
];

let current = 0;

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
      "If you are not being redirected automatically from the login page, please use the login command again, token may have expired or malformed"
    );
    page.once("framenavigated", async () => {
      let oldPage = page;
      // Loop through all the wallets found to monetize
      while (1) {
        page = await browser.newPage({ selected: false });
        await oldPage.close();
        oldPage = page;
        await page.setRequestInterception(true);
        // Send page with correct wallet info
        page.on("request", (r) => {
          setPaymentPage(r, monetizationPackages[current]);
        });

        monetizationPackages[current].state = "started";
        monetizationPackages.invokeListener(current, "monetizationstart");
        monetizationPackages.invokeListener(current, "monetizationprogress");

        await page.goto("https://example.com/");
        await page.evaluate(overrideVisibility);
        await page.waitFor(timePerPage >= 20000 ? timePerPage : 20000);
        await page.setRequestInterception(false);

        monetizationPackages[current].state = "pending";
        monetizationPackages.invokeListener(current, "monetizationstop");
        monetizationPackages.invokeListener(current, "monetizationpending");

        current = (current + 1) % monetizationPackages.length;
      }
    });
  } else {
    // User has not previously logged in
    console.log("Please Login first");
    process.exit();
  }
};

module.exports = monetize;
