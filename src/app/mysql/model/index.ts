const dbConfig = require('../config/config.ts');
const Sequelize = require('sequelize');

const sequelizeConfig = new Sequelize(
    dbConfig.db,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mariadb',
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
    }
);
var db: any = {};
db.sequelize = Sequelize;
db.sequelizeConfig = sequelizeConfig;
// db.tutorial = require("./tutorial.ts")(sequelizeConfig, Sequelize);
db.slack = require("./slack.ts")(sequelizeConfig, Sequelize);

module.exports = db;

