document.getElementById('compareForm').addEventListener('submit', compareUrls);

function compareUrls(event) {
    event.preventDefault();

    let url1 = document.getElementById('url1').value;
    let url2 = document.getElementById('url2').value;

    if (url1 && url2) {
        getData(url1, 'result1');
        getData(url2, 'result2');
    } else {
        alert("Por favor ingresa ambas URLs.");
    }
}

function getData(url, resultId) {
    let apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.websitecarbon.com/site?url=' + url)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontraron datos para la URL ingresada.');
            }
            return response.json();
        })
        .then(data => {
            let apiData = JSON.parse(data.contents);
            displayResult(apiData, resultId);
        })
        .catch(error => {
            document.getElementById(resultId).innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        });
}

function displayResult(data, resultId) {
    if (!data) {
        document.getElementById(resultId).innerHTML = `<p class="text-danger">Error: No se encontraron datos.</p>`;
        return;
    }

    let resultHtml = `
        <h5>Datos para: ${data.url}</h5>
        <p><strong>Bytes:</strong> ${data.bytes}</p>
        <p><strong>Más limpio que:</strong> ${Math.round(data.cleanerThan * 100)}%</p>
        <p><strong>Calificación:</strong> ${data.rating}</p>
        <p><strong>CO2 Gramos (Red eléctrica):</strong> ${data.statistics.co2.grid.grams}</p>
        <p><strong>CO2 Litros (Red eléctrica):</strong> ${data.statistics.co2.grid.litres}</p>
    `;

    document.getElementById(resultId).innerHTML = resultHtml;
    document.getElementById('results').style.display = 'block';
}
document.getElementById('compareForm').addEventListener('submit', compareUrls);

function compareUrls(event) {
    event.preventDefault();

    let url1 = document.getElementById('url1').value;
    let url2 = document.getElementById('url2').value;

    if (url1 && url2) {
        getData(url1, 'result1');
        getData(url2, 'result2');
    } else {
        alert("Por favor ingresa ambas URLs.");
    }
}

function getData(url, resultId) {
    let apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.websitecarbon.com/site?url=' + url)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontraron datos para la URL ingresada.');
            }
            return response.json();
        })
        .then(data => {
            let apiData = JSON.parse(data.contents);
            displayResult(apiData, resultId);
        })
        .catch(error => {
            document.getElementById(resultId).innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        });
}

function displayResult(data, resultId) {
    if (!data) {
        document.getElementById(resultId).innerHTML = `<p class="text-danger">Error: No se encontraron datos.</p>`;
        return;
    }

    let resultHtml = `
        <h5>Datos para: ${data.url}</h5>
        <p><strong>Bytes:</strong> ${data.bytes}</p>
        <p><strong>Más limpio que:</strong> ${Math.round(data.cleanerThan * 100)}%</p>
        <p><strong>Calificación:</strong> ${data.rating}</p>
        <p><strong>CO2 Gramos (Red eléctrica):</strong> ${data.statistics.co2.grid.grams}</p>
        <p><strong>CO2 Litros (Red eléctrica):</strong> ${data.statistics.co2.grid.litres}</p>
    `;

    document.getElementById(resultId).innerHTML = resultHtml;
    document.getElementById('results').style.display = 'block';
}
