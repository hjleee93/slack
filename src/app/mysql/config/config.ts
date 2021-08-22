module.exports = {
  host: "klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  username: "ffgg0ksx91tiu3ko",
  password: "urxvi7kgsn8vicyw",
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