const htmlToText = require('html-to-text');
let mailgun = require('mailgun-js');

mailgun.apiKey = process.env.MAILGUN_API_KEY;
mailgun.domain = process.env.MAILGUN_DOMAIN;

exports.send = options => {
  const text = htmlToText.fromString(options.html);

  var data = {
    from: `Artist-Tracker <noreply@artisttracker.com>`,
    to: options.user.email,
    subject: options.subject,
    html: options.html,
    text
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) console.log(error);
    console.log(body);
  });
};
