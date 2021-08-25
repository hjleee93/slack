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

db.slackUser = require("./slackUser")(sequelizeConfig, Sequelize);
db.workLog = require('./workLog')(sequelizeConfig, Sequelize);
db.bookingStatus = require('./bookingStatus')(sequelizeConfig, Sequelize);
db.participant = require('./participant')(sequelizeConfig, Sequelize);

//출퇴근
db.slackUser.hasMany(db.workLog, {sourceKey: 'user_id', foreignKey: 'user_id'});
db.workLog.belongsTo(db.slackUser, {foreignKey: 'user_id', targetKey: 'user_id'})

//미팅
db.bookingStatus.hasMany(db.participant,{sourceKey:'booking_id', foreignKey:'booking_id'});
db.participant.belongsTo(db.bookingStatus, {foreignKey:'booking_id', targetKey:'booking_id'});


module.exports = db;

