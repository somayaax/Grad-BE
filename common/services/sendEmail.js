const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(process.env.CLIENTID, process.env.CLIENTSECRETKEY)
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
async function sendEmail(dest, message) {
    const accessToken = OAuth2_client.getAccessToken()
    let transporter = nodemailer.createTransport({

        service: 'gmail',
        auth: {
            type: 'OAuth2',
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRETKEY,
            accessToken: accessToken,
            refreshToken: process.env.REFRESH_TOKEN,
            user: process.env.SENDER_EMAIL, // generated ethereal user
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Fred Foo 👻" <${process.env.SENDER_EMAIL}>`, // sender address
        to: dest, // list of receivers
        subject: "confirmationEmail ✔", // Subject line
        text: "hello confirmation email", // plain text body
        html: message, // html body
    });
}

module.exports = sendEmail