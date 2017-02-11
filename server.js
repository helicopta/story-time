const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ entended: false }));

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


app.post('/', (req, res) => {
    const authorName = req.body.name;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    db.Story.createStory(authorName, { title, content, tags }).then(() => res.redirect(303, `/${authorName}`));


});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
