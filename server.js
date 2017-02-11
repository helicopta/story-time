const express = require('express');
const app = express();
const db = require('./db');

db.sync().then(db.seed)
    .then(() => db.Story.getStories('poke gui'))
    .then(stuff => console.log(stuff[0].title, 1234));


app.get('/tag', (req, res) => {
    let options = {
        where: { tags: { $contains: [req.query.tag] } },
        include: [db.User]
    };
    db.Story.findAll(options).then(stories => res.json(stories.map(str => str.title)));
});

app.get('/:name?', (req, res) => {
    db.Story.getStories(req.params.name)
        .then(stories => res.json(stories.map(str => str.user.name)));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
