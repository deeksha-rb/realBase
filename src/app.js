const express = require("express");
const hbs = require('hbs');
const app = express();
const path = require("path");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); 

const connection = require("../src/database/database");
const static_path = path.join(__dirname, "../views");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "hbs");

app.use(express.static(static_path));
app.use(cookieParser()); 

const port = process.env.port || 3000;

app.get("/", (req, res) => { 
    res.render("index");
});

hbs.registerHelper('firstChar', function(str) {
  return str ? str.charAt(0) : ''; 
});

app.post('/', (req, res) => {
  const { EmailID, Password } = req.body;
  console.log('EmailID:', EmailID); 
  console.log('Password:', Password); 
  const query = 'SELECT * FROM users WHERE EmailID = ?';

  connection.query(query, [EmailID], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send({ message: 'Database error' });
      }

      if (results.length > 0) {
          const user = results[0];
          bcrypt.compare(Password, user.Password, (error, response) => {
              if (error) {
                  console.error('Bcrypt error:', error);
                  return res.status(500).send({ message: 'Bcrypt error' });
              }
              if (response) {
                  const id = user.id;
                  const token = jwt.sign({ id , Name: user.Name}, "jwtSecret", { expiresIn: '365d' });
                  res.cookie('token', token, { httpOnly: true });
                  res.redirect('/console');
              } else {
                  res.send({ message: "Wrong username/password combination!" });
              }
          });
      } else {
          res.render('index', { invalidCredentials: true });
      }
  });
});

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, 'jwtSecret', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      req.userId = decoded.id;
      next();
  });
}

app.get("/console", verifyToken, (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.decode(token);
  const Name = decoded.Name;
  res.render("console", { Name: Name });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
      const { id, Name, EmailID, Password } = req.body;
      const hashedPassword = await bcrypt.hash(Password, 10);
      const query = 'INSERT INTO users (id, Name, EmailID, Password) VALUES (?, ?, ?, ?)';

      connection.query(query, [id, Name, EmailID, hashedPassword], (err, results) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).send({ message: 'Database error' });
          }
          console.log("User registered successfully");
          res.redirect('/');
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(400).send(error);
  }
});

// ALTER TABLE `realbase`.`new_table` 
// ADD UNIQUE INDEX `idnew_table_UNIQUE` (`idnew_table` ASC) VISIBLE;
// ;
// CREATE TABLE `realbase`.`new_table` (
//     `idnew_table` INT NOT NULL,
//     PRIMARY KEY (`idnew_table`));

app.post("/console", (req, res) => {
    const {nameInput, CN, TP} = req.body;
    console.log(req.body);

    if (!Array.isArray(CN) || !Array.isArray(TP) || CN.length !== TP.length) {
        return res.status(400).send({ message: 'Invalid input data' });
    }

    let columnDefs = "";
    for (let i = 0; i < CN.length; i++) {
        columnDefs += `${CN[i]} ${TP[i]}, `;
    }
    columnDefs = columnDefs.slice(0, -2);

    const query = `CREATE TABLE  ${nameInput} (${columnDefs});`;
    console.log(connection.query);
    connection.query(query, (err, results) =>  {
        if (err) {
            console.error('Could not create table', err);
            return res.status(500).send({ message: 'Could not create table' });
        }
        console.log("Table created successfully");
        res.redirect('/views')
    });
});


app.get("/views", (req, res) => {
    res.render("views");
}); 

function retrieveID(req, res, next){
    const token = req.cookies.token;
    // if (!token) {
    //     return res.status(401).send({ auth: false, message: 'No token provided.' });
    // }

    const decoded = jwt.decode(token);
    // if (!decoded || !decoded.id) {
    //     return res.status(401).send({ auth: false, message: 'Invalid token.' });
    // }

    req.ID = decoded.id;
    next();
}

app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
});
