// import workLog from "./workLog";
const workLog = require('./workLog')

module.exports = (sequelize: any, DataTypes: any) => {
    let slackUser = sequelize.define("slackUser", {
        user_id: {type:DataTypes.STRING, unique:true},
        user_name: DataTypes.STRING,

    });
    // slackUser.association = ((models:any)=>{
    //     slackUser.hasMany(workLog, {onDelete: 'Cascade'})
    // })




    return slackUser;
}