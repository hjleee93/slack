"use strict";
module.exports = {
    host: "ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    username: "hvc6qu9s7g7m9gcl:ahlzzxi08jucurwx",
    password: "ahlzzxi08jucurwx",
    db: "test",
    dialect: "mariadb",
    timezone: '+09:00',
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    }
};
//# sourceMappingURL=config.js.map