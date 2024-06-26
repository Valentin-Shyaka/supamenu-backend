const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/connectionPool');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: string
 *       FullNames:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       phone:
 *         type: string
 *     required:
 *       - fullNames
 *       - email
 *       - password
 *       - phone
 */
const User = sequelize.define('user-table', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fullNames: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});

// Sync employee model with the database
(async () => {
  try {
    await User.sync();
    console.log("User table created successfully");
  } catch (err) {
    console.error("Error syncing User table:", err);
  }
})();

User.prototype.generateAuthToken = function () {
  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET);
  return token;
};

module.exports = User;

module.exports.validateUser = (body, isUpdating = false) => {
  return Joi.object({
    fullNames: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/(?<!\d)\d{10}(?!\d)/).required(),
    password: isUpdating ? Joi.string().min(6) : Joi.string().min(6).required(),
    
  }).validate(body);
};

module.exports.validateUserLogin = (body) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(body);
};


module.exports.NationalIdPattern = /(?<!\d)\d{16}(?!\d)/;
module.exports.PhoneRegex = /(?<!\d)\d{10}(?!\d)/