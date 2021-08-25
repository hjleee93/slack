module.exports = {
  host: "localhost",
  username: "hj",
  password: "Hjleee93@",
  db: "slack_test",
  dialect: "mariadb",


  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true
  },
  define: {
    underscored: true,
    freezeTableName: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at"
  }
};