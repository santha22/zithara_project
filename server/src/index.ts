require('dotenv').config();
const { Client, Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

const pool = new Pool({
  connectionString: process.env.DB,
});

app.post('/api/insertMultiple', async (req:any, res:any) => {
  const client = await pool.connect();

  try {
    const { records } = req.body;

    await client.query('BEGIN');

    for (const record of records) {
      const { customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time } = record;

      await client.query(
        'INSERT INTO customer_records (customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [customer_name, age, phone, location, created_at_timestamp, created_at_date, created_at_time]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Records inserted successfully!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

app.get('/api/getAllRecords', async (req:any, res:any) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM customer_records');
    const records = result.rows;
    res.status(200).json(records);
  } catch (error) {
    console.error('Error retrieving records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
