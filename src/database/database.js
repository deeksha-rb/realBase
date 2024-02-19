const mysql = require("mysql")

const connection = mysql.createConnection(
    {
        host : "localhost", 
        user : "root",
        password : "Deeksha@630",
        database : "realBase"
    }
);

connection.connect(function(error) {
    if(error)
    {
        throw error;
    }
    else 
    {
        console.log('Connected succesfully');
    }
});

module.exports = connection;
