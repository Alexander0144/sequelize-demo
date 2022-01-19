const Sequelize = require("sequelize");
const connectionConfig = {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
const db = new Sequelize('codegig', 'postgres', '123456', connectionConfig);

module.exports = db;