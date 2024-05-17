require('dotenv').config()
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.hostname,
    port: process.env.emailport,
    auth: {
        user: process.env.emailuser,
        pass: process.env.emailpass
    },
});


module.exports = { transporter  }
