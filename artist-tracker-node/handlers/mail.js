const htmlToText = require('html-to-text');
var mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

exports.send = options => {
  const html = `<h4>Your reset link is</h4> ${options.resetURL}`;
  const text = htmlToText.fromString(html);

  var data = {
    from: `Artist-Tracker <noreply@artisttracker.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) console.log(error);
    console.log(body);
  });
};
