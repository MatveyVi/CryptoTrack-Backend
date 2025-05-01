const nodemailer = require('nodemailer')

class MailController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Error:', error)
      } else {
        console.log('SMTP connection success:', success)
      }
    })
    
  }

  async sendActivationMail(to, name, link) {
    await this.transporter.sendMail({
      from: `"CryptoTrack" <${process.env.SMTP_USER}>`,
      to,
      subject: `Активация аккаунта на CryptoTrack`,
      html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .content {
            text-align: center;
            margin-top: 20px;
          }
          .content h2 {
            color: #333;
          }
            .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none; /* Убирает подчеркивание */
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 20px;
            border: none; /* Убирает возможное обрамление */
            }

            .button:focus,
            .button:hover {
            background-color: #45a049; /* Темнее при наведении */
            outline: none; /* Убирает обводку при фокусе */
            }

            .button:active {
            background-color: #388E3C; /* При нажатии кнопка темнеет */
            }

          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Подтвердите свой email</h1>
          </div>
          <div class="content">
            <h2>Привет, ${name}!</h2>
            <p>Спасибо за регистрацию. Для активации вашего аккаунта, пожалуйста, перейдите по следующей ссылке:</p>
            <a href="${link}" class="button">Активировать аккаунт</a>
          </div>
          <div class="footer">
            <p>Если вы не регистрировались, просто игнорируйте это письмо.</p>
            <p>&copy; ${new Date().getFullYear()} CryptoTrack</p>
          </div>
        </div>
      </body>
    </html>
    `
    })
  }
}

module.exports = new MailController()
