const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "puma1999SH",{dialect: "mysql", host: "localhost"});

module.exports = sequelize;