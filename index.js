const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./config/database");

const app = express();

// Handlebars init

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.urlencoded({extended: false}));


// Set static folder

app.use(express.static(path.join(__dirname, 'public')));

db.authenticate().then(() => {console.log("Connection established...")})
                  .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.status(200).render('index', {layout: 'landing'});
});

// API routes

app.use("/gigs", require("./routes/gigs"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});