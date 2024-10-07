const axios = require('axios');
const apiKey = 'KEY'; //
const apiUrl = 'https://www.websitecarbon.com/api/'

axios.get(apiUrl, {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
})
.then(response => {
    const data = response.data;
    // Procesar los datos aquí
    console.log(data);
})
.catch(error => {
    console.error('Error al obtener datos:', error);
});
