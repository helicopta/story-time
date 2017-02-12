const express = require('express');
const app = express();
const db = require('./db');
const swig = require('swig');
const bodyParser = require('body-parser');

swig.setDefaults({ cache: false });
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use(bodyParser.urlencoded({ entended: false }));

db.sync().then(db.seed)
    .then(() => db.Story.getStoriesByAuthor('poke gui'))
    .then(stuff => console.log(stuff[0].title, 1234));


app.use((req, res, next) => {
    req.method = req.query._changeMethod ? req.query._changeMethod : req.method;
    next();
});


app.get('/tag', (req, res) => {
    db.Story.getStoriesByTag(req.query.tag).then(stories => res.render('index', { stories, tag: req.query.tag }));
});

app.get('/:name?', (req, res) => {
    db.Story.getStoriesByAuthor(req.params.name)
        .then(stories => res.render('index', { stories, name: req.params.name }));
});


app.post('/', (req, res) => {
    const authorName = req.body.name;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    db.Story.createStory(authorName, { title, content, tags }).then(() => res.redirect(303, `/${authorName}`));


});

app.delete('/:name', (req, res) => {
    const authorName = req.params.name;
    if (authorName) {
        return db.User.destroy({ where: { name: authorName } }).then(() => res.redirect(303, '/'));
    }
    res.redirect(303, '/');
});

app.delete('/:id', (req, res) => {
    const storyId = req.params.id;
    // if (storyId) {
    //     return db.Story.destroy({ where: { id: storyId } }).then(() => res.redirect(303, '/'));
    // }
    res.redirect(303, '/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
