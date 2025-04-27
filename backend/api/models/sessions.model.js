import { type } from "os";
import { DataTypes } from "sequelize";
export default (sequelize, Sequelize) => {
  const Sessions = sequelize.define("Sessions", {
    bookerEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      validators: {
        isEmail: true,
      },
    },
    providerEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      validators: {
        isEmail: true,
      },
    },
    slot: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sessionTiming: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    messages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("Pending", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Unknown title Session - BrainBridge",
    },
    meetingId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return Sessions;
};
