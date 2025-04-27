import { DataTypes } from "sequelize";
export default (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      validators: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    authenticated: {
      type: Sequelize.BOOLEAN,
    },
    role: {
      type: Sequelize.ENUM("learner", "mentor"),
      allowNull: false,
    },
    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    expertise: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    ratings: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    sessions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sessionsCompleted: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    priceRange: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    AboutMe: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bannerImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sessionBooked: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    gpayId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    feedback: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });
  return User;
};
