const express = require("express");
const app = express();
const path = require("path");

const database = require("./database/database");

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
app.set("view engine ", "hbs");

const port = process.env.port || 3000;

app.get("/", (req, res) => { 
    res.render("index");
});

app.get("/signIn", (req, res) => {
    res.render("signIn");
})



app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
});
