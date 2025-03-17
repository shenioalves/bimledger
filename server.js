const express = require('express');
const { PORT } = require('./config.js');
const { getPavimentoData } = require('./data-service');

let app = express();
app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));

app.get('/pavimento', async (req, res) => {
    try {
        const data = await getPavimentoData();
        res.json(data);
    } catch (error) {
        res.status(500).send('Erro ao buscar os dados');
    }
});

app.listen(PORT, function () { console.log(`Server listening on port ${PORT}...`); });
