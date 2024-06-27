// Memuat data JSON menggunakan Fetch API
fetch('./salesCategoryByLocation.json')
    .then(response => response.json())
    .then(data => {
        // Data JSON berhasil dimuat
        console.log(data);

        // Memanggil fungsi untuk memulai chart
        initializeChart(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function initializeChart(salesCategoryByLocation) {
    const ctx5 = document.getElementById('chart5').getContext('2d');
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');

    const colors = {
        'Carbonated': {
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(128, 0, 0, 1)'
        },
        'Food': {
            backgroundColor: 'rgba(200, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)'
        },
        'Non Carbonated': {
            backgroundColor: 'rgba(255, 40, 0, 0.5)',
            borderColor: 'rgba(255, 40, 0, 1)'
        },
        'Water': {
            backgroundColor: 'rgba(248, 131, 121, 0.5)',
            borderColor: 'rgba(248, 131, 121, 1)'
        }
    };

    function filterData(category, month) {
        let filteredData = month === 'all' ? salesCategoryByLocation.default : salesCategoryByLocation.periode.filter(entry => entry.Periode.toLowerCase() === month.toLowerCase());

        if (category !== 'all') {
            filteredData = filteredData.filter(entry => (entry.category || entry.Category).toLowerCase() === category.toLowerCase());
        }

        return filteredData;
    }

    function updateChart(category, month) {
        const filteredData = filterData(category, month);
        const labels = ['GuttenPlans', 'EB_Public_Library', 'Brunswick_Sq_Mall', 'Earle_Asphalt'];

        const datasets = ['Carbonated', 'Food', 'Non Carbonated', 'Water'].map(cat => {
            const data = filteredData.find(entry => (entry.category || entry.Category).toLowerCase() === cat.toLowerCase()) || {};
            return {
                label: cat,
                data: labels.map(label => parseFloat(data[label] || 0)),
                backgroundColor: colors[cat].backgroundColor,
                borderColor: colors[cat].borderColor,
                borderWidth: 1
            };
        });

        chart.data.labels = labels;
        chart.data.datasets = datasets;
        chart.update();
    }

    // Initialize chart with all data
    const initialData = filterData('all', 'all');
    const initialLabels = ['GuttenPlans', 'EB_Public_Library', 'Brunswick_Sq_Mall', 'Earle_Asphalt'];
    const initialDatasets = ['Carbonated', 'Food', 'Non Carbonated', 'Water'].map(cat => {
        const data = initialData.find(entry => (entry.category || entry.Category).toLowerCase() === cat.toLowerCase()) || {};
        return {
            label: cat,
            data: initialLabels.map(label => parseFloat(data[label] || 0)),
            backgroundColor: colors[cat].backgroundColor,
            borderColor: colors[cat].borderColor,
            borderWidth: 1
        };
    });

    // Create chart
    const chart = new Chart(ctx5, {
        type: 'bar',
        data: {
            labels: initialLabels,
            datasets: initialDatasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1000,
                        callback: function (value) {
                            return value;
                        }
                    }
                }
            }
        }
    });

    // Add event listeners to dropdowns
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

    // Initialize chart with 'all' category and 'all' month initially
    updateChart('all', 'all');
}
