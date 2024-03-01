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

connection.query('select * from customer', (err, result, fields) => {
    if(err) {
        return console.log(err);
    }
    return console.log(result);
});

module.exports = connection;
