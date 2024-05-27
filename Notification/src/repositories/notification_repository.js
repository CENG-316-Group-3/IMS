const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const { text } = require("express");

const CLIENT_ID = "861709858155-v2ne9am2k6e3df3n6ji2oc86smnduiga.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04UF1EmCFGKuICgYIARAAGAQSNwF-L9IrKMdFS20Ip2YL3XO6-Ixv6czn7bsNu14FnYdqLsuwmJCFpSDdtjDeY6CLDapYdwLrmls";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

mailSender = async function(mail_data){
    try{
        console.log("hüsseyin");
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: "iztech.ims.info@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        to = mail_data.receiver_mail;
        subject = mail_data.title;
        text2 = mail_data.content;

        const mailOptions = {
            from: "Iztech IMS <iztech.ims.info@gmail.com>",
            to: to,
            subject: subject,
            text:text2
            //html: "<h1>texthtml</h1>"
        }

        const result = await transport.sendMail(mailOptions);
        return result;
    }
    catch(error){
        return error;
    }
}


exports.sendMail = async function(mail_data){
    mailSender(mail_data).then(result => console.log("mail sent", result))
    .catch((error) => console.log(error.message));
}


exports.saveNotification = async function(notification_data){
    try{
        await Notification.create({
            sender_mail: notification_data.sender_mail,
            receiver_mail: notification_data.receiver_mail,
            notification_type: notification_data.notification_type,
            title: notification_data.title,
            content: notification_data.content
        });
    } catch(e){
        console.log(e);
    }
}

exports.getNotifications = async function(receiver_mail){
    
    try{
        const notifications = await Notification.findAll({
            where: {
                receiver_mail : receiver_mail
            }
        });
        return notifications;
    }
    catch(error){
        console.log(error);
    }
    
}

exports.getNotification = async function(id){
    try{
        const notifications = await Notification.findAll({
            where: {
                id : id
            }
        });
        await Notification.update({ has_opened: true }, {
            where: {
              id: id
            }
          });
        return notifications[0].dataValues;
    }
    catch(error){
        console.log(error);
    } 
}