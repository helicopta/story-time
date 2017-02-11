const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
    name: Sequelize.STRING
});

let connection;

const connect = () => {
    connection = connection || db.authenticate();
    return connection;
};

const seed = () => connect().then(() => User.create({ name: 'poke gui' }));

const sync = () => connect().then(() => db.sync({ force: true }));

module.exports = { db, seed, sync, User };
