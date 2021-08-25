module.exports = (sequelize: any, DataTypes: any) => {
    let bookingStatus = sequelize.define("bookingStatus", {
        booking_id: {type: DataTypes.STRING, unique: true},
        creator_id: {type: DataTypes.STRING},
        room_number: {type: DataTypes.INTEGER},
        title: {type: DataTypes.STRING},
        description: {type: DataTypes.STRING},
        date: {type: DataTypes.DATE},
        start:{type: DataTypes.DATE},
        end:{type: DataTypes.DATE},
        status: {type: DataTypes.STRING},
        participant_id: {type: DataTypes.STRING},
    });
    return bookingStatus;
}