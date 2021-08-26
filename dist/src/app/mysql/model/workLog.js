"use strict";
const slackUser = require('./slackUser');
module.exports = (sequelize, DataTypes) => {
    let workLog = sequelize.define("workLog", {
        user_id: DataTypes.STRING,
        start: {
            type: DataTypes.DATE,
        },
        end: {
            type: DataTypes.DATE,
        },
    });
    // workLog.association = ((models:any)=> {
    //     workLog.belongsTo(slackUser)
    // });
    //
    return workLog;
};
//# sourceMappingURL=workLog.js.map