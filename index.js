// index.js

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

// Replace these values with your actual API key
const apiKey = 'Your-api-key';

// Get today's date in the format 'YYYY-MM-DD'
const today = new Date().toISOString().split('T')[0];
const startDate = today;
const endDate = today;

app.get('/applovin', async (req, res) => {
  try {
    const apiUrl = `https://r.applovin.com/maxReport?api_key=${apiKey}&columns=day,hour,impressions,ecpm,estimated_revenue&format=json&start=${startDate}&end=${endDate}&sort_hour=DESC`;
    const response = await axios.get(apiUrl);
    const data = response.data.results;

    // Generate Bootstrap HTML table
    const tableHTML = `
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>Day</th>
            <th>Hour</th>
            <th>Impressions</th>
            <th>eCPM</th>
            <th>Estimated Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(entry => `
            <tr>
              <td>${entry.day}</td>
              <td>${entry.hour}</td>
              <td>${entry.impressions}</td>
              <td>$${parseFloat(entry.ecpm).toFixed(2)}</td>
              <td>$${parseFloat(entry.estimated_revenue).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <title>AppLovin Data</title>
      </head>
      <body>
        <div class="container mt-4">
          <h2 class="mb-4">AppLovin Revenue Data</h2>
          ${tableHTML}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
