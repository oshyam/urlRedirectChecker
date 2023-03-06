const puppeteer = require('puppeteer');
const fs = require('fs');
const { URL } = require('url');

// Define the URLs to visit
const urls = [
  [
    'https://vnexpress.net/fake-3408260.html',
'https://vnexpress.net/fake-4467549.html'
  ]
];

(async () => {
  const browser = await puppeteer.launch();
  const results = {};

  for (const url of urls[0]) {
    const page = await browser.newPage();
    await page.emulate(puppeteer.devices['iPhone X']);

    try {
      await page.goto(url);
    } catch (error) {
      console.error(`Failed to load ${url}: ${error}`);
      continue;
    }

    const domain_name = new URL(url).hostname.split('.')[0];
    if (!results[domain_name]) {
      results[domain_name] = [];
    }

    const oldUrl = url;
    const currentUrl = page.url().replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');
    console.log("Writing for file", currentUrl);
    results[domain_name].push({oldUrl, currentUrl});

    await page.close();
    console.log("Done and closing !");
  }

  await browser.close();

  const json = JSON.stringify(results, null, 2);
  const filename = `outputdb/results_${Object.keys(results)[0]}.json`;
  fs.writeFileSync(filename, json);
})();
