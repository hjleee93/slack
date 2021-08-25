
module.exports = (sequelize: any, DataTypes: any) => {
    let participant = sequelize.define("participant", {
        booking_id: {type: DataTypes.STRING, unique: true},
        participant_id:{type: DataTypes.STRING},
    });
    return participant;
}