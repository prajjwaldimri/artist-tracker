const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const Artist = mongoose.model('Artist');
const User = mongoose.model('User');
const request = require('request-promise-native');

// Adds user's selected artist to the database
exports.addArtist = async (req, res) => {
  let artist = await Artist.find({ discogs_id: req.body.artistId });

  if (artist.length <= 0) {
    artist = await saveNewArtist(req.body.artistId);
  }

  if (!artist.fans.includes(req.user._id)) {
    await Artist.findOneAndUpdate(
      { _id: artist._id },
      { $push: { fans: req.user._id } },
      { new: true }
    );
  }
  if (!req.user.fav_artists.includes(artist._id)) {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { fav_artists: artist._id } },
      { new: true }
    );
  }

  res.status(200).json({ success: 'Updated Successfully' });
};

exports.getArtist = async (req, res) => {
  let artist = await Artist.findOne({ _id: req.params.Id });
  let response = JSON.parse(
    await request({
      url: `https://api.discogs.com/artists/${artist.discogs_id}`,
      headers: {
        Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process
          .env.DISCOGS_SECRET}`,
        'User-Agent': 'request'
      }
    })
  );

  res.status(200).json(response);
};

const saveNewArtist = artistId => {
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
