const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors'); // Import CORS
const app = express();
const port = 3333;

app.use(bodyParser.json({ limit: "10mb" })); // Increase limit to 10 MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server läuft');
});

const mazeRoutes = require('./mazeRoutes');
app.use('/api/maze', mazeRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
