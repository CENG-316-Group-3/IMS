const Announcement = require("../models/Announcement");
const CoordinatorAnnouncement = require("../models/Coordinator_Announcement");

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


//Admin

exports.getAllCompanyAnnouncements = async function(userId) {
    console.log("repo")
    console.log(Announcement); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcements = await Announcement.findAll({});

        return announcements; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
}

exports.updateAnnouncementStatus = async function(announcementId, newStatus) {
    console.log("repo");
    console.log(announcementId);

    try {
        // Find the announcement by ID
        const announcement = await Announcement.findOne({
            where: { id: announcementId }
        });

        // Check if the announcement exists
        if (!announcement) {
            console.log(`Announcement with ID ${announcementId} not found.`);
            return { message: `Announcement with ID ${announcementId} not found.` };
        }

        // Update the announcement's status
        await announcement.update({ status: newStatus });

        console.log(`Announcement with ID ${announcementId} updated successfully.`);
        return { message: `Announcement with ID ${announcementId} updated successfully.` };
    } catch (error) {
        console.error('Error updating announcement status:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
};

exports.saveCoordinatorAnnouncement = async function(announcementData) {
    try{
        await CoordinatorAnnouncement.create({
            user_mail: announcementData.user_mail,
            title: announcementData.title,
            content: announcementData.content,
            file_path: announcementData.file_path
        });
    } catch(e){
        console.log(e);
    }
}

exports.updateCoordinatorAnnouncement = async function(announcementData) {
    try {
        // Check if the announcement with the same ID already exists
        const existingAnnouncement = await CoordinatorAnnouncement.findByPk(announcementData.id);

        await existingAnnouncement.update({
            user_mail: announcementData.user_mail,
            title: announcementData.title,
            content: announcementData.content,
            file_path: announcementData.file_path
            // Add other fields as needed
        });
        
    } catch (e) {
        console.log(e);
    }
}

exports.deleteCoordinatorAnnouncementById = async function(announcement_id) {
    try {
        // Attempt to delete the announcement with the provided ID
        const deleted = await CoordinatorAnnouncement.destroy({
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
        throw error; 
    }
};

exports.getCoordinatorAnnouncements = async function() {
    console.log("repo")
    console.log(Announcement); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcements = await CoordinatorAnnouncement.findAll({});

        return announcements; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
}

exports.getCoordinatorAnnouncementsforCoordinator = async function(user_mail) {
    console.log("repo")
    console.log(Announcement); // Ensure the correct model is imported
    try {
        // Fetch announcements where user_mail equals the provided userId
        const announcements = await CoordinatorAnnouncement.findAll({
            where: { user_mail: user_mail }
        });

        return announcements; // Return the list of announcements
    } catch (error) {
        console.error('Error fetching company announcements:', error);
        throw error; // Rethrow the error for error handling in the caller function
    }
}


exports.getCoordinatorAnnouncementById = async function(announcement_id){
    try {
        const announcement = await CoordinatorAnnouncement.findAll({
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

exports.getCompanyMailByAnnouncementId = async function(announcement_id){
    
        try {
          const announcement = await Announcement.findOne({
            attributes: ['user_mail'],
            where: {
              id: announcement_id
            }
          });
      
          if (announcement) {
            return announcement.user_mail;
          } else {
            return 'Announcement not found';
          }
        } catch (error) {
          console.error('Error fetching company mail:', error);
          throw error;
        
      };
}