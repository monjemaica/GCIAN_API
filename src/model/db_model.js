const mysql = require("mysql");
const dbconfig = require("../config/db_config");

const connection = mysql.createConnection({
  host: dbconfig.HOST,
  user: dbconfig.USER,
  password: dbconfig.PASSWORD,
  database: dbconfig.DB,
});

connection.connect((err, res) => {
    if (err) {
        console.log("error when connecting to db:", err);
        setTimeout(handleDisconnect, 2000); 
      } 
  console.log("Successfully connected to the database");
});

connection.on("error", (err) => {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(); 
    } else {
      throw err; 
    }
  });

module.exports = connection;
