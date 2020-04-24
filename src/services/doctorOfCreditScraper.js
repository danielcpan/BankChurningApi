const cheerio = require('cheerio');
const axios = require('axios');

const scrape = async () => {
  const getBankLinks = async () => {
    try {
      const url = 'https://www.doctorofcredit.com/best-bank-account-bonuses';
      const response = await axios({ method: 'get', url });
      const $ = await cheerio.load(response.data);
      const links = new Set();

      $('ul > li > a[data-wpel-link="internal"]').each((idx, el) => {
        const text = $(el).text();
        if (text.toLowerCase().includes('read')) {
          const link = $(el).attr('href');
          links.add(link);
        }
      });

      return [...links].slice(2);
    } catch (err) {
      console.log('Scrape failed:', err);
    }
  };

  try {
    const bonusLinks = await getBankLinks();
    // console.log('bonusLinks:', bonusLinks);
    const response = await axios({ method: 'get', url: bonusLinks[0] });
    const $ = await cheerio.load(response.data);

    console.log($('li strong').text());
  } catch (err) {
    console.log('err:', err);
  }
  // console.log(bonusLinks.length);
};


scrape();
