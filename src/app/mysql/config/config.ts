module.exports = {
  host: "localhost",
  username: "root",
  password: "Paeki0913!",
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