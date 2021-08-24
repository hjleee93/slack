import {Sequelize, Model} from "sequelize";
//
// class Slack extends Model {
//     static init(sequelize: any, DataTypes: any) {
//         return super.init(
//             {
//             userId: DataTypes.STRING,
//             userName: DataTypes.STRING,
//             workStart: {
//                 type: DataTypes.DATE,
//             },
//             workEnd: {
//                 type: DataTypes.DATE,
//             },
//         },
//             {
//                 tableName:
//                 sequelize})
//     }
// }

//
//
module.exports = (sequelize: any, DataTypes: any) => {
    let slack = sequelize.define("slack", {
        user_id:DataTypes.STRING,
        user_name:DataTypes.STRING,
        work_start: {
            type: DataTypes.DATE,
        },
        work_end: {
            type: DataTypes.DATE,

        },
    });
    return slack;
}