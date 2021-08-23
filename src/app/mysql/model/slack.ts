

module.exports = (sequelize: any, DataTypes: any) => {
    let slack = sequelize.define("slack", {
        userId:DataTypes.STRING,
        userName:DataTypes.STRING,
        workStart: {
            type: DataTypes.DATE,
        },
        workEnd: {
            type: DataTypes.DATE,

        },
    });
    return slack;
}