// database/models/User.js
const { DataTypes, ENUM } = require('sequelize');
const { sequelize } = require('../database_connection');

const CoordinatorAnnouncement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_mail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'coordinator_announcements'
});

CoordinatorAnnouncement.sync({});

module.exports = CoordinatorAnnouncement;