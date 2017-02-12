const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

//makes users table. Also ensure we have an id, createdAt, updatedAt
const User = db.define('user', {
    name: Sequelize.STRING
},{
    classMethods:{
    deleteUser:(authorName)=>{
        return User.destroy({where:{name:authorName}});
    }
}});

//makes stories table. with id, createdAt, updatedAt
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
    // adds methods to story that makes our life easier
    classMethods: {
        //will lookup and create a user if needed before getting stories
        //{title:title, content:content, tags:tags}
        createStory: (authorName, { title, content, tags }) => User.findOne({ where: { name: authorName } })
            .then(user => user ? user : User.create({ name: authorName }))
            .then(author => Story.create({ content, title, tags, userId: author.id })),

        //function that allows us to pull users and filter by name if present
        getStoriesByAuthor: (authorName) => {
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
        },
        getStoriesByTag: (tag) => {
            console.log(tag);
            let options = {
                where: { tags: { $contains: [tag] } },
                include: [User]
            };
            return Story.findAll(options);

        },
        getStoriesById: (id) => {
            let options = {
                where: { id },
            };
            return Story.findOne(options);

        },
        deleteStory:(storyId)=>{
            let filter={};
            filter.id=storyId;
            return Story.destroy({where: filter})
        }
    }
});

//tells relationship. Users can have many stories and a story has 1 user. adds userId to stories.
Story.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Story);

let connection;

//connects to db
const connect = () => {
    connection = connection || db.authenticate();
    return connection;
};

// makes inital data. Adds a user poke. then adds 3 stories and adds an addtional user faitzi
const seed = () => connect()
    .then(() => User.create({ name: 'poke gui' }))
    .then(author => Story.createStory('poke gui', { title: 'sexzia', content: 'boobah' }))
    .then(author => Story.createStory('poke gui', { title: 'yazu', content: 'fompe', tags: 'abc, xyz' }))
    .then(author => Story.createStory('faitzi', { title: 'danni is cool', content: 'super cool', tags: 'abc' }));

//deletes tables and ensure tables = models we have set up
const sync = () => connect().then(() => db.sync({ force: true }));

module.exports = { db, seed, sync, User, Story };
