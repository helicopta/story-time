const express = require('express');
const app = express();
const db = require('./db');

db.sync().then(db.seed);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
