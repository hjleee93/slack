
module.exports = (sequelize: any, DataTypes: any) => {
    let participant = sequelize.define("participant", {
        user_id:{type: DataTypes.STRING},
        booking_id:{type:DataTypes.INTEGER}
    });
    return participant;
}