document.getElementById('searchBtn').addEventListener('click', getURL);

// Obtenemos url ingresada por el usuario
function getURL(event) {
    event.preventDefault(); 
    // Definimos variable ingresada en el input con id "urlInput"
    let url = document.getElementById('urlInput').value;
    // Validamos que traiga una url
    if (url) {
        // Si la variable url no esta vacia, llama a la función getData
        getData(url);
    } else {
        // Si la variable url esta vacia muestra un mensaje de error        
        swal("Error", "Por favor ingrese una url e intentelo de nuevo", "warning");
    }
}

// Obtenemos información de la api para la url ingresada
function getData(url) {
    // Definimos la url para el consumo de la api (utilizamos allorigins para acceder a los datos)
    let apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.websitecarbon.com/site?url=' + url)}`;
    // Realizamos el GET (solicitud http)
    fetch(apiUrl)
        // Validamos que se obtenga una respuesta
        .then(response => {
            // Si no hay una respuesta se muestra un error
            if (!response.ok) {
                throw new Error('No se encontraron datos en la API, para el sitio web consultado.');
            }
            // Si hay una respuesta, la obtiene con formato json
            return response.json();
        })
        // Mostramos los datos que trae la api
        .then(data => {
            // Convertimos el JSON en un objeto de JS
            let apiData = JSON.parse(data.contents);
            // Mostramos el resultado en consola
            console.log('Api Data:', apiData);
            // Llamamos la función viewResult
            viewResult(apiData);
        })
        // Manejamos el error
        .catch(error => {
            // Mostramos el error en consola
            console.error('Error:', error);
            // Llamamos la función viewError
            viewError(error);
        });
}

// Mostramos la información que nos devuelve la api
function viewResult(data) {
    // Validamos si hay datos
    if (!data) {
        viewError(new Error('No se encontraron datos.'));
        return;
    }
    // Generamos htmll con los datos de la api
    let resultHtml = `
                <h4>Emisiones de carbono de: ${data.url}</h4>
                <p><strong>Calificación:</strong> ${data.rating}</p>
                <p><strong>Tamaño de la página:</strong> ${data.bytes} bytes</p>
                <p><strong>Más limpio que: </strong> El ${Math.round(data.cleanerThan * 100)}% de los sitios web</p>
                <p><strong>Emisiones de CO2 (energía convencional):</strong> ${data.statistics.co2.grid.grams} gramos = ${data.statistics.co2.grid.litres} litros </p>
                <p><strong>Emisiones de CO2 (energía renovable):</strong> ${data.statistics.co2.renewable.grams} gramos = ${data.statistics.co2.renewable.litres} litros</p>
            `;
    // Mostramos los resultados en el div con id result
    document.getElementById('result').innerHTML = resultHtml;
    document.getElementById('result').style.display = 'block';
}

// Mostramos mensaje de error
function viewError(error) {
    document.getElementById('result').innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    document.getElementById('result').style.display = 'block';
}