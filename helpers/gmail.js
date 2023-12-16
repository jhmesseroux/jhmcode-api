const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(data) {
    this.fullName = data.fullName;
    this.message = data.message;
    this.data = data;
    // this.from = `Marani App <${process.env.MAIL_USERNAME}>`;
    this.from = `<${data.email}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // gmail
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '5bd15bd76859d7',
        pass: '27fa67a062f87b',
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      data: this.data,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: process.env.MAIL_USERNAME,
      subject,
      html,
      // text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
  async contact() {
    await this.send('contact', 'Nuevo mensaje de ' + this.from);
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
};

// exports.transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//     clientId: process.env.OAUTH_CLIENTID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//   },
// });

// exports.mailOptions = {
//   from: 'jhmesseroux.developer@gmail.com',
//   to: 'messerouxjeanhilaire@gmail.com',
//   subject: 'Mail de contacto testing',
//   text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo voluptate quod est tenetur, reprehenderit totam aut inventore voluptatibus, officiis ullam, minima repellat quidem assumenda iste. Excepturi sequi ex fugit dolorem ratione nam cupiditate vel odio libero ea molestiae distinctio corrupti, deserunt, explicabo accusamus quia minima dolorum natus neque. Quia voluptatibus, unde enim vero reiciendis nobis nesciunt, ipsam sint molestiae assumenda nihil accusamus autem modi labore earum iure necessitatibus tempora at molestias ab officiis impedit explicabo cum. Enim dignissimos minus unde, modi saepe voluptas, possimus neque necessitatibus iusto sed voluptates distinctio quas repellat magni id nulla quis numquam quidem minima non?',
// };
