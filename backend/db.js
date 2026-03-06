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

let pool = null;
let poolConnected = false;

// sanitize host value: avoid proxy addresses leaking into DB config
// function resolveHost(raw) {
//   if (!raw) return 'localhost';
//   // if looks like a proxy / invalid host, fallback
//   if (raw.includes('proxy') || raw.includes('http') || raw.match(/\s/)) {
//     // console.warn(`Ignoring suspicious DB_HOST value: ${raw}, using localhost instead`);
//     return 'localhost';
//   }
//   return raw;
// }

try {
  const host = process.env.DB_HOST;
  pool = mysql.createPool({
    host,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'health_ai_db',
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pool.on('error', (err) => {
    console.warn('MySQL Pool Error:', err.code);
    poolConnected = false;
  });

  pool.on('connection', () => {
    poolConnected = true;
  });

  // Test connection
  pool.getConnection((err, conn) => {
    if (err) {
      console.warn('Database connection warning (non-blocking):', err.code || err.message);
      poolConnected = false;
    } else {
      poolConnected = true;
      if (conn) conn.release();
    }
  });
} catch (err) {
  console.warn('Database initialization warning:', err.message);
  poolConnected = false;
}

module.exports = pool ? pool.promise() : null;