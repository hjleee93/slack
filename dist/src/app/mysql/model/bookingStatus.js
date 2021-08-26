"use strict";
module.exports = (sequelize, DataTypes) => {
    let bookingStatus = sequelize.define("bookingStatus", {
        booking_id: { type: DataTypes.STRING, unique: true },
        creator_id: { type: DataTypes.STRING },
        room_number: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        date: { type: DataTypes.STRING },
        start: { type: DataTypes.STRING },
        end: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING },
        // participant_id: {type: DataTypes.STRING},
    });
    return bookingStatus;
};
//# sourceMappingURL=bookingStatus.js.map