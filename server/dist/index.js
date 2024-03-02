"use strict";
// require('dotenv').config()
// import { Client } from 'pg'
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const app = express();
// const port = 4000;
// app.use(bodyParser.json());
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your React app's URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   }));
//   let connected = true
// async function globalFunc(){
//     const client = new Client(process.env.DB)
//     if(connected){
//         await client.connect();
//         connected = false
//     }
// app.post('/api/insertMultiple', async (req:any, res:any) => {
//     try {
//         async function createUsersTable() {
//             const { records } = req.body;
//             // Using a transaction for multiple inserts
//             await client.query('BEGIN');
//             for (const record of records) {
//                 const { customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time } = record;
//                 await client.query(
//                 'INSERT INTO customer_records (customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//                 [customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time]
//                 );
//             }
//             await client.query('COMMIT');
//             res.status(200).json({ message: 'Records inserted successfully!' });
//             } 
//             createUsersTable();
//         }  catch (error) {
//             await client.query('ROLLBACK');
//             console.error('Error inserting records:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//             } 
// });
// app.get('/api/getAllRecords', async (req:any, res:any) => {
//     try {
//         console.log("hi");
//         const result = await client.query('SELECT * FROM customer_records');
//         const records = result.rows;
//         res.status(200).json(records);
//     } catch (error) {
//         console.error('Error retrieving records:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
// }
// globalFunc()
require('dotenv').config();
const { Client, Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
const pool = new Pool({
    connectionString: process.env.DB,
});
app.post('/api/insertMultiple', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const { records } = req.body;
        yield client.query('BEGIN');
        for (const record of records) {
            const { customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time } = record;
            yield client.query('INSERT INTO customer_records (customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time) VALUES ($1, $2, $3, $4, $5, $6, $7)', [customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time]);
        }
        yield client.query('COMMIT');
        res.status(200).json({ message: 'Records inserted successfully!' });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Error inserting records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        client.release();
    }
}));
app.get('/api/getAllRecords', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query('SELECT * FROM customer_records');
        const records = result.rows;
        res.status(200).json(records);
    }
    catch (error) {
        console.error('Error retrieving records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        client.release();
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
