const express = require('express');
const app = express();
const db = require('./db');

db.sync().then(db.seed)
    .then(() => db.Story.getStories('poke gui'))
    .then(stuff => console.log(stuff[0].title, 1234));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
