const Sequlize = require('sequlize');

const db = new Sequlize(process.env.DATABASE_URL);

const User = db.define('user', {
    name: Sequlize.STRING
});
