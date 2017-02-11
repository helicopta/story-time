const express = require('express');
const app = express();
const db = require('./db');

db.sync().then(db.seed)
    .then(() => db.Story.getStoriesByAuthor('poke gui'))
    .then(stuff => console.log(stuff[0].title, 1234));


app.get('/tag', (req, res) => {

    db.Story.getStoriesByTag(req.query.tag).then(stories => res.json(stories.map(str => str.title)));
});

app.get('/:name?', (req, res) => {
    db.Story.getStoriesByAuthor(req.params.name)
        .then(stories => res.json(stories.map(str => str.title)));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
