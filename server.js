const express = require('express');
const { PORT } = require('./config.js');
const cors = require('cors');

let app = express();

app.use(cors({
    origin: 'https://bim-ledger.vercel.app', // URL do frontend
    credentials: true
  }));

app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));

app.listen(PORT, function () { console.log(`Server listening on port ${PORT}...`); });
