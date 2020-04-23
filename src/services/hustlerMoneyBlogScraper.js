const cheerio = require('cheerio');
const axios = require('axios');

const scrape = async () => {
  try {
    const url = 'https://www.hustlermoneyblog.com/best-bank-promotions/';
    const response = await axios({ method: 'get', url, timeout: 1000 * 60 * 5 });

    return cheerio.load(response.data, { xml: { normalizeWhitespace: true } });
  } catch (err) {
    console.log('Scrape failed:', err);
  }
};

const scrapeData = async () => {
  try {
    const $ = await scrape();
  } catch (err) {
    console.log('err:', err);
  }
};
