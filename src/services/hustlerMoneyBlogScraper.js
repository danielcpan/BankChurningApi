const cheerio = require('cheerio');
const axios = require('axios');

const scrape = async () => {
  const getBankLinks = async () => {
    try {
      const url = 'https://www.hustlermoneyblog.com/best-bank-promotions/';
      const response = await axios({ method: 'get', url });
      const $ = await cheerio.load(response.data);
      const links = new Set();

      $('td > a').each((i, e) => {
        const text = $(e).text();
        if (text === 'Review') {
          const link = $(e).attr('href');
          if (link.includes('-promotions/') || link.includes('-bonus/')) links.add(link);
        }
      });

      return [...links];
    } catch (err) {
      console.log('Scrape failed:', err);
    }
  };

  try {
    const bankLinks = await getBankLinks();
    // console.log('bankLinks:', bankLinks[0]);
    const response = await axios({ method: 'get', url: bankLinks[0] });
    // console.log('response:', response);
    const $ = await cheerio.load(response.data);

    console.log($('div.entry-content > ul').text());
  } catch (err) {
    console.log('err:', err);
  }

  // console.log('bankLinks:', bankLinks);

  // const response = await axios({ method: 'get', url: bankLinks[0]})

  //     console.log('bankLinks:', bankLinks);
  //     console.log();
};

// const scrapeData = async () => {
//   try {
//     const $ = await scrape();

//     const
//   } catch (err) {
//     console.log('err:', err);
//   }
// };


scrape();

// const html = `<div id="tablepress-1_wrapper" class="dataTables_wrapper no-footer"><div id="tablepress-1_filter" class="dataTables_filter"><label>Search:<input type="search" class="" placeholder="" aria-controls="tablepress-1"></label></div><table id="tablepress-1" class="tablepress tablepress-id-1 dataTable no-footer" role="grid">
// <thead>
// <tr class="row-1 odd" role="row"><th class="column-1 sorting_disabled" rowspan="1" colspan="1" style="width: 515px;">Bank or Credit Union</th><th class="column-2 sorting_disabled" rowspan="1" colspan="1" style="width: 53px;">Bonus</th><th class="column-3 sorting_disabled" rowspan="1" colspan="1" style="width: 104px;">Expiration </th><th class="column-4 sorting_disabled" rowspan="1" colspan="1" style="width: 64px;">Review</th></tr>
// </thead>
// <tbody class="row-hover">


// <tr class="row-2 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Chase-Total-Business-Checking-B" target="_blank" rel="noopener noreferrer">Chase Total Business Checking®</a></td><td class="column-2">$300</td><td class="column-3">07/16/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/chase-business-checking-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-3 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Chase-Premier-Plus-Checking-L" target="_blank" rel="noopener noreferrer">Chase Premier Plus Checking<sup>SM</sup></a> </td><td class="column-2">$300 </td><td class="column-3">07/20/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/chase-premier-plus-checking-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-4 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Chase-Total-Checking-L" target="_blank" rel="noopener noreferrer"> Chase Total Checking®</a></td><td class="column-2">$200 </td><td class="column-3">07/20/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/chase-total-checking-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-5 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Discover-Bank-Online-Savings-I" target="_blank" rel="noopener noreferrer">Discover Bank Online Savings</a> <small><em>See advertiser website for full details</em></small></td><td class="column-2">$200</td><td class="column-3">05/11/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/discover-savings-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-6 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Discover-Bank-Online-Savings-I" target="_blank" rel="noopener noreferrer">Discover Bank Online Savings</a> <small><em>See advertiser website for full details</em></small></td><td class="column-2">$150</td><td class="column-3">05/11/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/discover-savings-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-7 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Huntington-H5-Checking" target="_blank" rel="noopener noreferrer">Huntington 5 Checking</a></td><td class="column-2">$200</td><td class="column-3">07/07/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/huntington-bank-5-checking-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-8 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/Huntington-Asterisk-Checking" target="_blank" rel="noopener noreferrer">Huntington Asterisk-Free Checking</a></td><td class="column-2">$150</td><td class="column-3">07/07/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/huntington-bank-asterisk-free-checking-bonus/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-9 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/HSBC-Premier-Checking-Account-B" target="_blank" rel="noopener noreferrer">HSBC Premier Checking</a> <em><small>Member FDIC</small></em></td><td class="column-2">$700</td><td class="column-3">06/29/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/HSBC-Premier-Checking-Account-B"><span style="color: red">Terms</span></a></td>
// </tr><tr class="row-10 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/HSBC-Premier-Checking-B2" target="_blank" rel="noopener noreferrer">HSBC Premier Checking</a> <em><small>Member FDIC</small></em></td><td class="column-2">$475</td><td class="column-3">06/29/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/HSBC-Premier-Checking-Account-B"><span style="color: red">Terms</span></a></td>
// </tr><tr class="row-11 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/HSBC-Advance-Checking-Account-B" target="_blank" rel="noopener noreferrer">HSBC Advance Checking</a> <em><small>Member FDIC</small></em></td><td class="column-2">$270</td><td class="column-3">06/29/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/HSBC-Advance-Checking-Account-B"><span style="color: red">Terms</span></a></td>
// </tr><tr class="row-12 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/HSBC-Advance-Checking-B2" target="_blank" rel="noopener noreferrer">HSBC Advance Checking</a> <em><small>Member FDIC</small></em></td><td class="column-2">$225</td><td class="column-3">06/29/2020</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/HSBC-Advance-Checking-Account-B"><span style="color: red">Terms</span></a></td>
// </tr><tr class="row-13 odd" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/TD-Checking-L" target="_blank" rel="noopener noreferrer">TD Bank Beyond Checking</a></td><td class="column-2">$300</td><td class="column-3">None</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/td-bank-premier-checking-promotion/"><span style="color: red">Review</span></a></td>
// </tr><tr class="row-14 even" role="row">
// <td class="column-1"><a href="https://www.hustlermoneyblog.com/TD-Checking-L" target="_blank" rel="noopener noreferrer">TD Bank Convenience Checking</a></td><td class="column-2">$150</td><td class="column-3">None</td><td class="column-4"><a href="https://www.hustlermoneyblog.com/td-bank-convenience-checking-promotion/"><span style="color: red">Review</span></a></td>
// </tr></tbody>
// </table></div>`;

// const $ = cheerio.load(html);

// $('.dataTables_wrapper').each(function (i, elm) {
//   console.log($(this).text()); // for testing do text()
// });
