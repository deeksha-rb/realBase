const express = require("express");
const app = express();
const path = require("path");
// const encoder = require("body-parser");

const connection = require("../src/database/database");
const static_path = path.join(__dirname, "../views");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "hbs");

app.use(express.static(static_path));

const port = process.env.port || 3000;

app.get("/", (req, res) => { 
    res.render("index");
});

app.get("/signIn", (req, res) => {
    res.render("signIn");
});

app.post('/signin', (req, res) => {

  const { emailID, password } = req.body;
  const query = 'SELECT * FROM customer WHERE emailID = ? AND password = ?';

  connection.query(query, [emailID, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid Email ID or password');
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req,res) => {
    try {
      console.log(req.body.emailID);
      res.send(req.body.emailID);
    } 
    catch (error) {
      res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
});
