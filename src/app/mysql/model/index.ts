const dbConfig = require('../config/config');
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
            // acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
    }
);
let db: any = {};
db.sequelize = Sequelize;
db.sequelizeConfig = sequelizeConfig;
// db.tutorial = require("./tutorial.ts")(sequelizeConfig, Sequelize);
db.slack = require("./slack")(sequelizeConfig, Sequelize);

db.slackUser = require("./slackUser")(sequelizeConfig, Sequelize);
db.workLog = require('./workLog')(sequelizeConfig, Sequelize);

// db.association = (models:any)=>{
//     console.log('association', models)
    db.slackUser.hasMany(db.workLog, {sourceKey: 'user_id', foreignKey: 'user_id'});
    db.workLog.belongsTo(db.slackUser, {foreignKey:'user_id', targetKey:'user_id'})
// }

module.exports = db;

