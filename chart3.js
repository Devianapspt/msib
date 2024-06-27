fetch('./typeByLocation.json')
     .then(response => response.json())
     .then(data => {
        console.log(data);
        initializeChart(data);
     })
    .catch(erro => console.error('Error loading JSON:', error));

function initializeChart(typeByLocation) {
const ctx3 = document.getElementById('chart3').getContext('2d');
const categoryFilter = document.getElementById('category-filter');
const monthFilter = document.getElementById('month-filter');

function filterData(category, month) {
    let filteredData = [];

    if (month === 'all' && category === 'all') {
        filteredData = typeByLocation.default;
    } else if (month === 'all') {
        filteredData = typeByLocation.category.flat().filter(entry => entry.category.toLowerCase() === category.toLowerCase());
    } else if (category === 'all') {
        filteredData = typeByLocation.periode.flat().filter(entry => entry.periode.toLowerCase() === month.toLowerCase());
    } else {
        filteredData = typeByLocation.periode_category.filter(entry => 
            entry.periode.toLowerCase() === month.toLowerCase() &&
            entry.category.toLowerCase() === category.toLowerCase()
        );
    }

    return filteredData;
}

function updateChart(category, month) {
    const filteredData = filterData(category, month);
    const locations = filteredData.map(entry => entry.location || entry.Location);
    const totalCash = filteredData.map(entry => parseFloat(entry.total_cash) || 0);
    const totalCredit = filteredData.map(entry => parseFloat(entry.total_credit) || 0);

    chart.data.labels = locations;
    chart.data.datasets[0].data = totalCash;
    chart.data.datasets[1].data = totalCredit;
    chart.update();
}

// Create initial chart
const initialData = typeByLocation.default;
const initialLocations = initialData.map(entry => entry.location);
const initialTotalCash = initialData.map(entry => parseFloat(entry.total_cash) || 0);
const initialTotalCredit = initialData.map(entry => parseFloat(entry.total_credit) || 0);

const chart = new Chart(ctx3, {
    type: 'bar',
    data: {
        labels: initialLocations,
        datasets: [{
            label: 'Transaction Total (Cash)',
            data: initialTotalCash,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',  
            borderWidth: 1
        }, {
            label: 'Transaction Total (Credit)',
            data: initialTotalCredit,
            backgroundColor: 'rgba(248, 131, 121, 0.5)', 
            borderColor: 'rgba(248, 131, 121, 1)',  
            borderWidth: 1
        }]
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
}


