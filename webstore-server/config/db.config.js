require('dotenv').config();

let dbUrl;

if (process.env.NODE_ENV === 'production') {
  // Production Database URL
  dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?replicaSet=${process.env.DB_REPLICA_SET}&ssl=${process.env.DB_SSL}&authSource=${process.env.DB_AUTH_SOURCE}`;
} else {
  // Development Database URL
  dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

module.exports = {
  url: dbUrl
};