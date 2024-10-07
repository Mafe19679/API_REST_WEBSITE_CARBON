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
                <h4>Emisiones de carbono generadas  por: ${data.url}</h4>
                <p>Este sitio es más limpio que el <strong>${Math.round(data.cleanerThan * 100)}% </strong> de los sitios web.</p>
                <p><strong>Calificación:</strong> ${data.rating}</p>
                <div id="ratingChart"></div>
                <div class="d-flex justify-content-center">
                <div id="CO2GramsChart"></div>
                <div id="CO2LitresChart"></div>
               </div>
               <h6>Los datos presentados corresponden a la emisión de carbono generada por cada carga de ${data.url}.</h6>
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

// Gráfico creados con ApexCharts
function createChart(data) {
    // Constante ratingValues con los gramos por categoria/rating
    const ratingValues = { 'A+': 0.095, 'A': 0.186, 'B': 0.341, 'C': 0.493, 'D': 0.656, 'E': 0.846, 'F': 0.847 };
    // Obtenemos del rating del sitio web
    let websiteRating = data.rating;
    let websiteValue = ratingValues[websiteRating];

    // Configuramos el grafico de Rating
    const ratingChart = {
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
            categories: Object.keys(ratingValues),
            title: {
                text: 'Categorias',
            },
            max: 1
        },
        // Configuracion eje y
        yaxis: {
            title: {
                text: 'Gramos CO2',
            }
        },
        // Barras y colores
        series: [{
            name: 'Gramos',
            type: 'bar',
            data: [
                { x: 'A+', y: ratingValues['A+'], fillColor: 'rgba(0, 255, 188, 0.6)' },
                { x: 'A', y: ratingValues['A'], fillColor: 'rgba(25, 255, 148, 0.6)' },
                { x: 'B', y: ratingValues['B'], fillColor: 'rgba(72, 255, 66, 0.6)' },
                { x: 'C', y: ratingValues['C'], fillColor: 'rgba(111, 255, 6, 0.6)' },
                { x: 'D', y: ratingValues['D'], fillColor: 'rgba(249, 255, 0, 0.6)' },
                { x: 'E', y: ratingValues['E'], fillColor: 'rgba(255, 168, 0, 0.6)' },
                { x: 'F', y: ratingValues['F'], fillColor: 'rgba(255, 0, 0, 0.6)' }
            ]
        },],
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
    };

    // Obtenemos los gramos y litros de CO2 del sitio web
    let websiteCO2GridGram = data.statistics.co2.grid.grams;
    let websiteCO2RenewableGram = data.statistics.co2.renewable.grams;
    let websiteCO2GridLitres = data.statistics.co2.grid.litres;
    let websiteCO2RenewableLitres = data.statistics.co2.renewable.litres;

    // Configuramos grafico de co2 gramos
    var CO2GramsChart = {
        //  Tipo de grafico
        series: [websiteCO2GridGram, websiteCO2RenewableGram],
        chart: {
            width: 380,
            type: 'pie'
        },
        // Etiquetas de datos %
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#000'],
                fontWeight: 'bold',
                align: 'center'
            },
            dropShadow: {
                enabled: false
            }
        },
        // Valores del grafico
        labels: [
            `Energia Convencional (gramos): ${websiteCO2GridGram.toFixed(4)}`,
            `Energia Renovable (gramos): ${websiteCO2RenewableGram.toFixed(4)}`
        ],
        // Titulo
        title: {
            text: 'Emisiones de CO2 en Gramos',
            align: 'center'
        },
        // Detalle de grafico
        tooltip: {
            y: {
                text:'',
                formatter: function () {
                    return '';
                }
            }
        },
        // leyenda
        legend: {
            position: 'bottom'
        },
        // Responsive ajuste a pantallas < 280px
        responsive: [{
            breakpoint: 280,
            options: {
                chart: {
                    width: 200
                }
            }
        }]
    };

    // Configuramos grafico de co2 gramos 
    var CO2LitresChart = {
        //  Tipo de grafico
        series: [websiteCO2GridLitres, websiteCO2RenewableLitres],
        chart: {
            width: 380,
            type: 'pie'
        },
        // Etiquetas de datos %
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#000'],
                fontWeight: 'bold',
                align: 'center'
            },
            dropShadow: {
                enabled: false
            }
        },
        // Valores del grafico
        labels: [
            `Energia Convencional (litros): ${websiteCO2GridLitres.toFixed(4)}`,
            `Energia Renovable (litros): ${websiteCO2RenewableLitres.toFixed(4)}`
        ],
        // Titulo
        title: {
            text: 'Emisiones de CO2 en Litros',
            align: 'center'
        },
        // Detalle de grafico
        tooltip: {
            y: {
                text:'',
                formatter: function () {
                    return '';
                }
            }
        },
        // leyenda
        legend: {
            position: 'bottom'
        },
        // Responsive ajuste a pantallas < 280px
        responsive: [{
            breakpoint: 280,
            options: {
                chart: {
                    width: 200
                }
            }
        }]
    };

    // Genera el grafico de barras (rating) y lo renderiza 
    const chart = new ApexCharts(document.querySelector("#ratingChart"), ratingChart);
    chart.render();
    // Genera el grafico de torta (gramos CO2) y lo renderiza 
    var chart1 = new ApexCharts(document.querySelector("#CO2GramsChart"), CO2GramsChart);
    chart1.render();
    // Genera el grafico de torta (litros CO2) y lo renderiza 
    var chart2 = new ApexCharts(document.querySelector("#CO2LitresChart"), CO2LitresChart);
    chart2.render();

}