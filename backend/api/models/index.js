import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import User from "./user.model.js";
import Message from "./messages.model.js";
import Sessions from "./sessions.model.js";
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  port: dbConfig.PORT,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = User(sequelize, Sequelize);
db.messages = Message(sequelize, Sequelize);
db.sessions = Sessions(sequelize, Sequelize);
export default db;
