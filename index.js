require("dotenv").config();

const DEBUG_ENABLED_FLAG = 1;
const IN_PRODUCTION_FLAG = 1;

const DEBUG_ENABLED = process.env.DEBUG == DEBUG_ENABLED_FLAG;
const IN_PRODUCTION = process.env.IN_PRODUCTION == IN_PRODUCTION_FLAG;

((log) => {
  console.log = (...args) => {
    if (!DEBUG_ENABLED) return;

    log(...args);
  };
})(console.log);

const cors = require("cors");
const express = require("express");
const chrome = require("chrome-aws-lambda");

const puppeteer = require("puppeteer");
const { workerMain } = require("./endpoints");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
)(async function () {
  const launchOptions = {
    args: ["--no-sandbox"],
    defaultViewport: chrome.defaultViewport,
    headless: IN_PRODUCTION ? "new" : false,
  };

  const browser = await puppeteer.launch(launchOptions);

  app.get("/", async (req, res) => {
    const page = await browser.newPage();

    workerMain(req, res, page);
  });

  app.listen(PORT, () => console.log(`Application running on PORT: ${PORT}`));
})();
