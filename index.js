const express = require('express');
const database = require("./config/database");
const Routerv1 = require('./api/v1/routes/index.route');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
database.connect();
const app = express();
const port = process.env.PORT;
// const corsOptions = {
//     origin: 'http://localhost:3000',

// }
// app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json());

Routerv1(app);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 