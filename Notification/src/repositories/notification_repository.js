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
        return notifications;
    }
    catch(error){
        console.log(error);
    }
    
}

exports.getAnnouncementById = async function(announcement_id){

    console.log("repo")
    console.log(announcement_id); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcement = await Announcement.findAll({
            where: {
                id: announcement_id
            }
        });
        
        return announcement; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }

}


exports.getAnnouncementsByStatus = async function(status) {
    console.log("repo")
    console.log(Announcement); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcements = await Announcement.findAll({
            where: {
                status: status,//It might have brackets.TEST
            }
        });

        return announcements; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
}

//Company

exports.getCompanyAnnouncements = async function(userId) {
    console.log("repo")
    console.log(Announcement); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcements = await Announcement.findAll({
            where: {
                user_mail: userId
            }
        });

        return announcements; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
}

exports.saveInternshipAnnouncement = async function(announcementData) {
    console.log("repo")
    console.log(Announcement);
    try{
        await Announcement.create({
            user_mail: announcementData.user_mail,
            title: announcementData.title,
            position: announcementData.position,
            content: announcementData.content,
            file_path: announcementData.file_path
        });
    } catch(e){
        console.log("repo/saveInternship");
        console.log(e);
    }
}


exports.updateInternshipAnnouncement = async function(announcementData) {
    console.log("repo")
    console.log(Announcement);
    try {
        // Check if the announcement with the same ID already exists
        const existingAnnouncement = await Announcement.findByPk(announcementData.id);

        if (existingAnnouncement) {
            // If the announcement exists, update its attributes
            await existingAnnouncement.update({
                user_mail: announcementData.user_mail,
                title: announcementData.title,
                position: announcementData.position,
                content: announcementData.content,
                file_path: announcementData.file_path
                // Add other fields as needed
            });
        } else {
            // If the announcement doesn't exist, create a new one
            await Announcement.create({
                user_mail: announcementData.user_mail,
                title: announcementData.title,
                position: announcementData.position,
                content: announcementData.content,
                file_path: announcementData.file_path
                // Add other fields as needed
            });
        }
    } catch (e) {
        console.log("repo/saveInternship");
        console.log(e);
    }
}


exports.deleteAnnouncementById = async function(announcement_id) {
    console.log("repo");
    console.log(announcement_id);

    try {
        // Attempt to delete the announcement with the provided ID
        const deleted = await Announcement.destroy({
            where: {
                id: announcement_id
            }
        });

        if (deleted) {
            console.log(`Announcement with ID ${announcement_id} deleted successfully.`);
            return { message: `Announcement with ID ${announcement_id} deleted successfully.` };
        } else {
            console.log(`Announcement with ID ${announcement_id} not found.`);
            return { message: `Announcement with ID ${announcement_id} not found.` };
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
};


