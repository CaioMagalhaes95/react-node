const express = require('express')
const pkg = require('pg')
const dotenv = require('dotenv')

const app = express()
const port = 3000

const cors = require('cors'); // importar

// permitir apenas o origin do seu front-end (ex: Vite default: http://localhost:5173)
app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json());

const { Pool } = pkg

// load .env early so process.env variables are populated
dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

// health check
app.get('/', (req, res) => res.json({ ok: true }))

// fixed route path (leading slash) and improved logging
app.get('/api/get', async (req, res) => {
        try {
            const { rows } = await pool.query('SELECT * FROM form;');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

});

app.post('/api/post', async (req, res) => {
    try{
       
        const {name, email} = req.body
        if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
        }
        const sql = 'INSERT INTO form (name, email) VALUES ($1, $2)'

        const {rows} = await pool.query(sql, [name, email])

        return res.status(201).json(rows[0]);

    } catch (error){
        console.error('Error inserting row:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  
    }
})

// start the server after routes are defined
const chosenPort = process.env.PORT || port;
app.listen(chosenPort, () => {
    console.log(`Server running on http://localhost:${chosenPort}`);

    // helpful debug information
    if (process.env.DATABASE_URL) {
        console.log('DATABASE_URL is set. DB pool initialized.');
    } else {
        console.warn('DATABASE_URL not set — DB queries will fail until set in .env or environment.');
    }
});