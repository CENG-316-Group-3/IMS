const { sequelize } = require('../database_connection');
const { DataTypes } = require('sequelize');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sender_mail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver_mail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notification_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
  },
  has_opened: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'notifications'
});

Notification.sync({});

module.exports = Notification;