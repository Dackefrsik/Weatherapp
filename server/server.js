require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Logga inkommande requests (hjälper felsökning)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// API-nyckel-endpoint
const apiKey = process.env.API_KEY || '';
app.get('/api-key', (req, res) => {
  res.json({ apiKey });
});

// Serve statiska mappar explicit så att /style/... och /js/... returnerar korrekta filer
app.use('/style', express.static(path.join(__dirname, '..', 'static', 'style')));
app.use('/js', express.static(path.join(__dirname, '..', 'static', 'js')));
app.use('/image', express.static(path.join(__dirname, '..', 'static', 'image')));
app.use('/', express.static(path.join(__dirname, '..', 'static', 'html')));

// Proxy-route för geokodning (server-side anrop till Nominatim)
app.get('/api/geocode', async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: 'Missing q query parameter' });
  }

  try {
    const url = 'https://nominatim.openstreetmap.org/search';
    // Nominatim kräver en User-Agent; sätt en som beskriver din applikation
    const response = await axios.get(url, {
      params: { format: 'json', limit: 3, q },
      headers: { 'User-Agent': 'WeatherApp/1.0 (contact@yourdomain.example)' },
      timeout: 10000
    });

    // Returnera JSON direkt till klienten (samma-origin => ingen CORS-block)
    res.json(response.data);
  } catch (err) {
    console.error('Nominatim fetch error:', err && err.message ? err.message : err);
    // Vid 403/5xx från Nominatim returnera 502 vidare till klienten
    res.status(502).json({ error: 'Failed to fetch geocode data' });
  }
});

// Fallback index (valfritt)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'html', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servern kör på http://localhost:${port}`);
});