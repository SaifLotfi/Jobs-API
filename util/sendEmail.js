import nodemailer from 'nodemailer';
import 'dotenv/config.js';

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
    },
});

const sendEmail = (email, subject, text) => {
    let mailDetails = {
        from: process.env.TRANSPORTER_EMAIL,
        to: email,
        subject: subject,
        text: text,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
};


export default sendEmail;