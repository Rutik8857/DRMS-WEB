// const mysql = require('mysql2');
// require('dotenv').config();

// // const pool = mysql.createPool({
// //     host: process.env.DB_HOST || 'localhost',
// //     user: process.env.DB_USER || 'root',
// //     password: process.env.DB_PASSWORD || 'Rutik@8857',
// //     database: process.env.DB_NAME || 'health_ai_db',
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     queueLimit: 0
// // });



// const pool = mysql.createPool({
//     host: process.env.DB_HOST ,
//     user: process.env.DB_USER ,      // Replace with your MySQL username
//     password: process.env.DB_PASSWORD ,      // Replace with your MySQL password
//     database: process.env.DB_NAME ,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0

// })

// module.exports = pool.promise();





const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();