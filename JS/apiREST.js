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
            // Llamamos la funcion donde creamos el grafico
            createChart(apiData);
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
                <h4>Emisiones de carbono producidas por: ${data.url}</h4>
                <h6>La información a continuación es por 1 carga en el sitio web.</h6>
                <p><strong>Calificación:</strong> ${data.rating}</p>
                <div id="chart"></div>
                <p><strong>Este sitio web es más limpio que el </strong> ${Math.round(data.cleanerThan * 100)}% de los sitios web</p>
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

//-------------------------------------------------------------------------------------------------------------------

// Gráfico que muestra el rating
function createChart(data) {
    // Constante ratingValues con los gramos por categoria/rating
    const categoryValues = { 'A+': 0.095, 'A': 0.186, 'B': 0.341, 'C': 0.493, 'D': 0.656, 'E': 0.846, 'F': 0.847 };
    // Obtenemos del rating del sitio web
    let websiteRating = data.rating;
    let websiteValue = categoryValues[websiteRating];

    // Creamos y personalizamos el grafico
    const options = {
        // Detalles del grafico (tipo, tamaño, barra de herramientas)
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: true }
        },
        // Detalle de barras (orientacion, estilo, ancho)
        plotOptions: {
            bar: { 
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '40%',
            }
        },
        // Muestra valores de cada barra
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#000'],  
                fontWeight: 'bold' 
            }
        },
        // Configuracion eje x
        xaxis: {
            categories: Object.keys(categoryValues),
            labels: {
                show: true,
            },
            max: 1
        },
        series: [{
            name: 'Gramos',
            data: [
                { x: 'A+', y: categoryValues['A+'], fillColor: 'rgba(0, 255, 188, 0.6)' },
                { x: 'A', y: categoryValues['A'], fillColor: 'rgba(25, 255, 148, 0.6)' },
                { x: 'B', y: categoryValues['B'], fillColor: 'rgba(72, 255, 66, 0.6)' },
                { x: 'C', y: categoryValues['C'], fillColor: 'rgba(111, 255, 6, 0.6)' },
                { x: 'D', y: categoryValues['D'], fillColor: 'rgba(249, 255, 0, 0.6)' },
                { x: 'E', y: categoryValues['E'], fillColor: 'rgba(255, 168, 0, 0.6)' },
                { x: 'F', y: categoryValues['F'], fillColor: 'rgba(255, 0, 0, 0.6)' }
            ]
        }],
        // Linea e info rating sitio web
        annotations: {
            yaxis: [{
                y: websiteValue,
                borderColor: '#000000', 
            }],
            xaxis: [{
                x: websiteRating, 
                label: {
                    text: `Calificación: ${websiteRating} (${websiteValue} gr)`,
                    style: {
                        color: '#fff',
                        background: '#000',

                    },
                    offsetX: 8
                }
            }]
        },
        // Tooltip
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val) => {
                    return `${val} gr`;
                }
            }
        }
    };

    // Genera el grafico y lo renderiza 
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    
}