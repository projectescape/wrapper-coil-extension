const puppeteer = require("puppeteer");
const fs = require("fs");

const login = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const [page] = await browser.pages();
  await page.goto("https://coil.com/login");
  page.on("framenavigated", async () => {
    // Get user token from localStorage
    const token = await page.evaluate(async () => {
      const token = await localStorage.getItem("token");
      return token;
    });
    // Store token for later use
    await fs.writeFile(
      `${__dirname}/../store/profile.json`,
      JSON.stringify({ token }),
      (err) => {
        if (err) {
          console.log("Unable to write to login", err);
        }
      }
    );
    console.log("Logged in");
    await browser.close();
  });
};

module.exports = login;
