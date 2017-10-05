const fs = require('fs');
const { promisify } = require('util');
const Handlebars = require('handlebars');
const htmlToText = require('html-to-text');
let apiKey = process.env.MAILGUN_API_KEY;
let domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain });

exports.send = options => {
  return new Promise((resolve, reject) => {
    const readFile = promisify(fs.readFile);
    let html = '';

    readFile(`${options.file}`).then(async hbs => {
      if (!options.html) {
        let template = Handlebars.compile(hbs.toString());
        let templateData = { reset_password_url: options.resetURL };
        html = template(templateData);
      }
      html = options.html;

      const text = htmlToText.fromString(html);

      var data = {
        from: `Artist-Tracker <noreply@artisttracker.com>`,
        to: options.user.email,
        subject: options.subject,
        html: html,
        text
      };

      const result = await mailgun.messages().send(data);
      console.log(result);
      resolve();
    });
  });
};
