const express = require("express");
const app = express();
const path = require("path");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

app.post('/', (req, res) => {

  const { EmailID, Password } = req.body;
  const query = 'SELECT * FROM users WHERE EmailID = ? AND Password = ?';

  connection.query(query, [EmailID, Password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) 
    {
      res.redirect('/console');

      // bcrypt.compare(Password, results[0].Password, (error, response) =>{
      //   if (response){
      //     const id = results[0].id
      //     const token = jwt.sign({id},"jwtSecret",{
      //       expiresIn: 300,
      //     })
      //     req.session.user = results;
      //     res.json({auth:true, token: token, result: result});
      //   }else{
      //     res.send({message: "Wrong user's name/password combination!"});
      // }
      // });

    } else {
      res.render('index', { invalidCredentials: true });
    }
  });
});

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//   jwt.verify(token, 'jwtSecret', function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

//     req.id = decoded.id;
//     next();
//   });
// }

//verify token define do
//, { Name: Name }

app.get("/console", (req,res) => {
  // const token = req.headers['authorization'];
  // const decoded = jwt.decode(token, {complete: true});
  // const Name = decoded.payload.Name;
  res.render("console");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req,res) => {
    try {
      const Password = req.body.Password;
      const confirmPassword = req.body.confirmPassword;

      if (Password == confirmPassword) {
        const { id, Name, EmailID, Password } = req.body;
        const query = 'INSERT INTO users ( id, Name, EmailID, Password ) VALUES (?, ?, ?, ?)';
        
        connection.query(query, [id, Name, EmailID, Password], (err, results) => {
          if (err) throw err;
          // res.render('register', { successful: true });
          console.log("User registered successfully");
          res.redirect('/')
        });
      }
    } 
    catch (error) {
      res.status(400).send(error);
    }
});

app.get("/tables", (req,res) => {
    res.render("tables")
}); 

app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
});
