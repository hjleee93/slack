"use strict";
const dbConfig = require('../config/config');
const Sequelize = require('sequelize');
const sequelizeConfig = new Sequelize(dbConfig.db, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mariadb',
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});
var db = {};
db.sequelize = Sequelize;
db.sequelizeConfig = sequelizeConfig;
// db.tutorial = require("./tutorial.ts")(sequelizeConfig, Sequelize);
db.slack = require("./slack")(sequelizeConfig, Sequelize);
module.exports = db;
//# sourceMappingURL=index.js.map