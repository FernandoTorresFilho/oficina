const knex = require('knex');

const connection = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'escola',
  },
  useNullAsDefault: true,
});

module.exports = connection;
