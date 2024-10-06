const express = require('express');
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Datos simulados de huella de carbono
const carbonData = [
    { id: 1, page: 'page1', carbonFootprint: 40 },
    { id: 2, page: 'page2', carbonFootprint: 60 },
    { id: 3, page: 'page3', carbonFootprint: 30 }
];

// Endpoint para obtener datos de huella de carbono
app.get('/api/carbon', (req, res) => {
    res.json(carbonData);
});

// Endpoint para enviar notificación (simulada)
app.post('/api/notify', (req, res) => {
    const { message } = req.body;
    // Aquí iría la lógica para enviar la notificación
    console.log(`Notificación enviada: ${message}`);
    res.send(`Notificación enviada: ${message}`);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
