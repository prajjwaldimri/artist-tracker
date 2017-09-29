const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const Artist = mongoose.model('Artist');
const request = require('request-promise-native');

exports.saveNewArtist = artistId => {
  return new Promise(async (resolve, reject) => {
    // Get the latest release id for the artist from discogs
    let response = JSON.parse(
      await request({
        url: `https://api.discogs.com/artists/${artistId}/releases?sort=year&sort_order=desc&per_page=1`,
        headers: {
          Authorization: `Discogs key=${process.env
            .DISCOGS_KEY}, secret=${process.env.DISCOGS_SECRET}`,
          'User-Agent': 'request'
        }
      })
    );
    // Save the artist to the database and return the saved artist
    Artist.create(
      { discogs_id: artistId, latest_release_id: response.releases[0].id },
      (err, artist) => {
        if (err) {
          reject(err);
        }
        resolve(artist);
      }
    );
  });
};
