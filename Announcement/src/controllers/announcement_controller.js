const AnnouncementRepository = require('../repositories/announcement_repository');


const notification_connection = require("../service_connections/notification_connection");


// Function to handle getAnnouncementbyId
exports.getAnnouncementById = async (msgContent, channel, message) => {
    try {
        const announcement = await AnnouncementRepository.getAnnouncementById(msgContent.id);
        const exchange = 'direct_logs';    
        const response = { message: announcement, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId})
  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId})
    }
};

// Function to handle getCompanyAnnouncements
exports.getCompanyAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCompanyAnnouncements(msgContent.user_mail);
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }    
};


exports.createInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs'; 
        const { user_mail, title, position, content, file_path } = msgContent;
        await AnnouncementRepository.saveInternshipAnnouncement({user_mail, title, position, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle updateInternshipAnnouncement
exports.updateInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        const { id, user_mail, title, position, content, file_path } = msgContent;
        await AnnouncementRepository.updateInternshipAnnouncement({ id, user_mail, title, position, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle deleteInternshipAnnouncement
exports.deleteInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        await AnnouncementRepository.deleteAnnouncementById(msgContent.id);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

exports.rejectInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        await notification_connection.sendRejectAnnouncementNotification(msgContent);
        await notification_connection.sendRejectAnnouncementNotificationMail(msgContent);
        await AnnouncementRepository.deleteAnnouncementById(msgContent.id);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
        
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

exports.getAllCompanyAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAllCompanyAnnouncements();
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }    
};

// Function to handle getWaitingAnnouncements
exports.getWaitingAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAnnouncementsByStatus("waiting_for_approvation");
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.createCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs'; 
        const { user_mail, title, content, file_path } = msgContent;
        await AnnouncementRepository.saveCoordinatorAnnouncement({user_mail, title, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status:200})),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400})),{
            correlationId: message.properties.correlationId});
    }
};

exports.updateCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        const { id, user_mail, title, content, file_path } = msgContent;
        await AnnouncementRepository.updateCoordinatorAnnouncement({ id, user_mail, title, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

exports.deleteCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        await AnnouncementRepository.deleteCoordinatorAnnouncementById(msgContent.id);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle approveAnnouncement
exports.approveAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';  
        await AnnouncementRepository.updateAnnouncementStatus(msgContent.id, "approved");
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});        
        notification_connection.sendApproveAnnouncementNotification(msgContent)    
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};



// Function to handle getApprovedAnnouncements
exports.getApprovedAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAnnouncementsByStatus("approved");
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.getCoordinatorAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncements();
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 };  
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.getCoordinatorAnnouncementsforCoordinator = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncementsforCoordinator(msgContent.user_mail);
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};


exports.getCoordinatorAnnouncementbyId = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncementById(msgContent.id);
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId})
  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId})
    }
};
