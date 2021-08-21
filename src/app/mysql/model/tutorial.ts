// mappings between a model and a table 테이블 만들기~!
// will then automatically add the attributes createdAt and updatedAt

module.exports = (sequelize: any, DataTypes: any) => {
    let tutorial = sequelize.define("tutorial", {
        title: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        published: { type: DataTypes.BOOLEAN },
    });
    return tutorial;
}