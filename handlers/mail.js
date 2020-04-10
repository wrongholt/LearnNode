const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmltotext = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.Mail_HOST,
  port: process.env.Mail_PORT,
  auth: {
  user: process.env.Mail_USER,
  pass: process.env.Mail_PASS,
  }

});
const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`,
  options);
  const inlined = juice(html);
  return inlined
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmltotext.fromString(html);
  const mailOptions = {
    from: 'The Tales of Old <info@thetalesofold.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}