"use strict";
module.exports = (sequelize, DataTypes) => {
    let slack = sequelize.define("slack", {
        workStart: {
            type: DataTypes.DATE,
        },
        workEnd: {
            type: DataTypes.DATE,
        },
    });
    return slack;
};
//# sourceMappingURL=slack.js.map