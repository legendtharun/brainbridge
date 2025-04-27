// models/message.js (suggested filename)

// Import necessary types from Sequelize
import { type } from "os";
import { DataTypes } from "sequelize";

// Define the model function that Sequelize will call
export default (sequelize) => {
  // Define the 'Message' model (Sequelize uses singular names by convention)
  const Message = sequelize.define("Message", {
    // Column: id
    id: {
      type: DataTypes.INTEGER, // Maps to INT
      allowNull: false, // Checkbox 'Allow Null' is unchecked
      primaryKey: true, // Key icon indicates it's the primary key
      autoIncrement: true, // Default value shown as 'AUTO_INCREMENT'
    },

    // Column: providerEmail
    providerEmail: {
      type: DataTypes.STRING, // Maps to VARCHAR(255) - 255 is default for STRING
      // type: DataTypes.STRING(255), // More explicit if needed
      allowNull: false, // Checkbox 'Allow Null' is unchecked
      // 'No default' means no specific defaultValue needed here
    },

    // Column: bookerEmail
    bookerEmail: {
      type: DataTypes.STRING, // Maps to VARCHAR(255)
      allowNull: false, // Checkbox 'Allow Null' is unchecked
    },

    // Column: header
    header: {
      // !!! IMPORTANT: Replace these values with your actual ENUM list !!!
      type: DataTypes.ENUM("Booking", "Message"), // Maps to ENUM
      allowNull: false, // Checkbox 'Allow Null' is unchecked
      // Default value shown as '' (empty string)
    },

    // Column: message
    message: {
      type: DataTypes.TEXT, // Maps to TEXT
      allowNull: false, // Checkbox 'Allow Null' is unchecked
    },

    // Column: slots
    slots: {
      type: DataTypes.JSON, // Maps to JSON
      allowNull: true, // Checkbox 'Allow Null' IS CHECKED
      // Default value 'NULL' is implied by allowNull: true
    },
    opened: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    providerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookerProfile: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Accepted", "Rejected", "Expired"),
      allowNull: true,
    },
  });

  return Message;
};
