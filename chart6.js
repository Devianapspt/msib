// Memuat data JSON menggunakan Fetch API
fetch('./salesInBsqMall.json')
    .then(response => response.json())
    .then(data => {
        // Data JSON berhasil dimuat
        console.log(data);

        // Memanggil fungsi untuk memulai chart
        initializeChart(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function initializeChart(salesInBsqMall) {
    const ctx = document.getElementById('chart6').getContext('2d');
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');

    function filterData(category, month) {
        let filteredData = [];

        if (month === 'all' && category === 'all') {
            filteredData = salesInBsqMall.default;
        } else if (month === 'all') {
            filteredData = salesInBsqMall.category.flat().filter(entry => entry.Category.toLowerCase() === category.toLowerCase());
        } else if (category === 'all') {
            filteredData = salesInBsqMall.periode.filter(entry => entry.periode.toLowerCase() === month.toLowerCase());
        } else {
            filteredData = salesInBsqMall.periode_category.filter(entry => 
                entry.month.toLowerCase() === month.toLowerCase() &&
                entry.category.toLowerCase() === category.toLowerCase()
            );
        }

        return filteredData;
    }

    function updateChart(category, month) {
        const filteredData = filterData(category, month);
        const labels = filteredData.map(entry => entry.machine);
        const data = filteredData.map(entry => parseInt(entry.total_sales));
        const totalSales = data.reduce((acc, value) => acc + value, 0);

        chart6.data.labels = labels;
        chart6.data.datasets[0].data = data;
        chart6.options.plugins.tooltip.callbacks.label = function(context) {
            const value = context.raw;
            const percentage = ((value / totalSales) * 100).toFixed(2) + '%';
            return context.label + ': ' + value + ' (' + percentage + ')';
        };
        chart6.update();
    }

    // Create initial chart
    const initialData = salesInBsqMall.default;
    const initialLabels = initialData.map(entry => entry.machine);
    const initialDataValues = initialData.map(entry => parseInt(entry.total_sales));
    const initialTotalSales = initialDataValues.reduce((acc, value) => acc + value, 0);

    const chart6 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: initialLabels,
            datasets: [{
                data: initialDataValues,
                backgroundColor: [
                    'rgba(255, 40, 0, 0.5)', 
                    'rgba(248, 131, 121, 0.5)',  
                ],
                borderColor: [
                    'rgba(255, 40, 0, 1)', 
                    'rgba(248, 131, 121, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / initialTotalSales) * 100).toFixed(2) + '%';
                            return context.label + ': ' + value + ' (' + percentage + ')';
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
