// // db.js
// const mysql = require('mysql2');
// require('dotenv').config();

// // const db = mysql.createPool({
// //     host: process.env.DB_HOST || 'localhost',
// //     user: process.env.DB_USER || 'root',      // Replace with your MySQL username
// //     password: process.env.DB_PASSWORD || 'Rutik@8857',      // Replace with your MySQL password
// //     database: process.env.DB_NAME || 'health_ai_db'
// // });


// const db = mysql.createPool({
//     host: process.env.DB_HOST ,
//     user: process.env.DB_USER ,      // Replace with your MySQL username
//     password: process.env.DB_PASSWORD ,      // Replace with your MySQL password
//     database: process.env.DB_NAME ,
//     port: process.env.DB_PORT
// })




// db.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err.message);
//     } else {
//         console.log('Connected to MySQL Database');
//         connection.release();
//     }
// });

// module.exports = db.promise(); // Use promise for async/await













// // config/db.js
// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,

//     ssl: {
//         rejectUnauthorized: false
//     },

//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// db.getConnection((err, connection) => {
//     if (err) {
//         console.error('❌ Error connecting to MySQL:', err);
//     } else {
//         console.log('✅ Connected to Railway MySQL 🚀');
//         connection.release();
//     }
// });

// module.exports = db.promise();



const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
  } else {
    console.log("✅ Connected to Railway MySQL 🚀");
    connection.release();
  }
});

module.exports = db.promise();