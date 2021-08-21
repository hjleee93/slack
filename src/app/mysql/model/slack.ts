

module.exports = (sequelize: any, DataTypes: any) => {
    let slack = sequelize.define("slack", {
        workStart: {
            type: DataTypes.DATE,
        },
        workEnd: {
            type: DataTypes.DATE,

        },
    });
    return slack;
}