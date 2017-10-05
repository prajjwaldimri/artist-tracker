const request = require('request-promise-native');

exports.searchForm = (req, res) => {
  res.render('search', { title: 'Search for artists' });
};

exports.search = async (req, res) => {
  let response = await request({
    url: `https://api.discogs.com/database/search?q=${req.body
      .artistName}&type=artist`,
    headers: {
      Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process
        .env.DISCOGS_SECRET}`,
      'User-Agent': 'request'
    }
  });
  res.render('search', {
    title: `Search Results for ${req.body.artistName}`,
    searchResult: JSON.parse(response)
  })();
};
