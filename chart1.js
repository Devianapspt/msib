// Memuat data JSON menggunakan Fetch API
fetch('./AvgBasketSizeByLocation.json')
    .then(response => response.json())
    .then(data => {
        // Data JSON berhasil dimuat
        console.log(data);

        // Memanggil fungsi untuk melanjutkan logika
        initializeChart(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function initializeChart(AvgBasketSizeByLocation) {
    const ctx1 = document.getElementById('barchart').getContext('2d');
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');

    function filterData(category, month) {
        let filteredData = [];

        if (month === 'all' && category === 'all') {
            filteredData = AvgBasketSizeByLocation.default;
        } else if (month === 'all') {
            filteredData = AvgBasketSizeByLocation.category.flat().filter(entry => entry.category.toLowerCase() === category.toLowerCase());
        } else if (category === 'all') {
            filteredData = AvgBasketSizeByLocation.periode.flat().filter(entry => entry.periode.toLowerCase() === month.toLowerCase());
        } else {
            filteredData = AvgBasketSizeByLocation.periode_category.flat().filter(entry => entry.periode.toLowerCase() === month.toLowerCase())
                        .filter(entry => entry.category.toLowerCase() === category.toLowerCase());
        }

        return filteredData;
    }

    function updateChart(category, month) {
        const filteredData = filterData(category, month);
        
        if (!Array.isArray(filteredData)) {
            console.error('Filtered data is not an array:', filteredData);
            return;
        }

        const locations = filteredData.map(entry => entry.Location || entry.location);
        const abs = filteredData.map(entry => parseFloat(entry.ABS));

        barchart.data.labels = locations;
        barchart.data.datasets[0].data = abs;
        barchart.update();
    }

    // Membuat chart awal
    const initialData = filterData('all', 'all');

    if (!Array.isArray(initialData)) {
        console.error('Initial data is not an array:', initialData);
        return;
    }

    const initialLocations = initialData.map(entry => entry.Location || entry.location);
    const initialABS = initialData.map(entry => parseFloat(entry.ABS));

    const barchart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: initialLocations,
            datasets: [{
                label:'Average Basket Size (ABS)',
                data: initialABS,
                backgroundColor: 'rgba(190, 0, 0, 0.5)',
                borderColor: 'rgba(190, 0, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            return value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Menambahkan event listeners ke dropdown
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const selectedMonth = monthFilter.value;
        updateChart(selectedCategory, selectedMonth);
    });

    monthFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const selectedMonth = monthFilter.value;
        updateChart(selectedCategory, selectedMonth);
    });
}
