"use strict";
module.exports = (sequelize, DataTypes) => {
    let participant = sequelize.define("participant", {
        user_id: { type: DataTypes.STRING },
        booking_id: { type: DataTypes.INTEGER }
    });
    return participant;
};
//# sourceMappingURL=participant.js.map