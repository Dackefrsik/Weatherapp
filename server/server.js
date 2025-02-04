require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Använd CORS-mellanvara
app.use(cors());

// Din API-nyckel, lagrad som en miljövariabel
const apiKey = process.env.API_KEY;

// Endpoint för att hämta API-nyckeln
app.get('/api-key', (req, res) => {
  res.json({ apiKey: apiKey });
});

// Serve index.html och andra statiska filer
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servern kör på http://localhost:${port}`);
});