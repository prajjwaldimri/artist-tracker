// Hourly checks the discogs API for new releases from artists

const mongoose = require('mongoose');
const request = require('request-promise-native');
const chalk = require('chalk');
mongoose.promise = global.Promise;
require('dotenv').config({ path: 'variables.env' });
const mailer = require('./handlers/mail');

// Connect to the database
mongoose.connect(process.env.MLAB_DB);

// Require Models for mongoose
const Artist = require('./models/artist');
const User = require('./models/user');
// Get all the artits ids currently in the database
(() => {
  Artist.find({})
    .select('discogs_id latest_release_id fans')
    .exec(async (err, artists) => {
      if (err) {
        throw err;
      }
      for (var i = 0; i < artists.length; i++) {
        // Query the discogs api for newer releases for the artists
        let newReleases = await ReleaseChecker(
          artists[i].discogs_id,
          artists[i].latest_release_id
        );

        // Update the artist model's newest release
        if (newReleases.length > 0) {
          await Artist.findOneAndUpdate(
            { _id: artists[i]._id },
            { $set: { latest_release_id: newReleases[0].id } },
            { new: true }
          );
        }

        // Send all the emails for this artist
        await MailReleases(newReleases, artists[i]);
      }
      console.log(chalk.green('Scheduler Complete'));
      process.exit();
    });
})();

// Checks for new releases from an artist and returns the new releases about which the users should be notified
const ReleaseChecker = function (artistId, releaseId) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.discogs.com/artists/${artistId}/releases?sort=year&sort_order=desc&per_page=10`,
      headers: {
        Authorization: `Discogs key=${process.env.DISCOGS_KEY}, secret=${process
          .env.DISCOGS_SECRET}`,
        'User-Agent': 'request'
      }
    })
      .then(async (response, body) => {
        response = JSON.parse(response);
        let newReleases = [];
        // Traverse to the latest release id till which we have reported
        for (var i = 0; i < response.releases.length; i++) {
          if (response.releases[i].id === releaseId) {
            break;
          }
          newReleases.push(response.releases[i]);
        }

        resolve(newReleases);
      })
      .catch(error => {
        console.log(chalk.red(error));
        reject(error);
      });
  });
};

const MailReleases = (releases, artist) => {
  return new Promise(async (resolve, reject) => {
    // For every release
    for (let i = 0; i < releases.length; i++) {
      // Send email to all the fans of this artist
      for (let j = 0; j < artist.fans.length; j++) {
        if (artist.fans[j].length <= 0) {
          break;
        }
        let user = await User.findOne({ _id: artist.fans[j] });
        console.log(chalk.green(JSON.stringify(user)));
        if (user) {
          await mailer.send({
            subject: `New release by ${releases[i].artist}`,
            user: { email: user.email },
            html: `<h3> ${releases[i].artist} has a new ${releases[i]
              .type} titled ${releases[i].title}</h3>`,
            file: './src/templates/forgetEmailTemplate.hbs'
          });
        }
      }
    }
    resolve();
  });
};
