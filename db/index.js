const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
    name: Sequelize.STRING
});

const Story = db.define('story', {
    content: Sequelize.STRING,
    title: Sequelize.STRING,
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        set: function(val) {
            let tags = val ? val.split(',').map(tag => tag.trim()) : null;
            this.setDataValue('tags', tags);
        }
    },
}, {
    classMethods: {
        createStory: (authorName, { title, content, tags }) => User.findOne({ where: { name: authorName } })
            .then(user => user ? user : User.create({ name: authorName }))
            .then(author => Story.create({ content, title, tags, userId: author.id })),
        getStories: (authorName) => {
            let filter = {};
            if (authorName) {
                filter.name = authorName;
            }
            return Story.findAll({
                include: [{
                    model: User,
                    where: filter
                }]
            });
        }
    }
});

Story.belongsTo(User);
User.hasMany(Story);

let connection;

const connect = () => {
    connection = connection || db.authenticate();
    return connection;
};

const seed = () => connect()
    .then(() => User.create({ name: 'poke gui' }))
    .then(author => Story.createStory('poke gui', { title: 'sexzia', content: 'boobah' }))
    .then(author => Story.createStory('poke gui', { title: 'yazu', content: 'fompe', tags: '1,2,3,4,5' }))
    .then(author => Story.createStory('faitzi', { title: 'danni is cool', content: 'super cool', tags: '1,2,3' }));
const sync = () => connect().then(() => db.sync({ force: true }));

module.exports = { db, seed, sync, User, Story };
