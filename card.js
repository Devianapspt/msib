// Memuat data JSON menggunakan Fetch API
fetch('./salesByCategory.json')
    .then(response => response.json())
    .then(data => {
        // Data JSON berhasil dimuat
        console.log(data);

        // Memanggil fungsi untuk memulai display data
        initializeSalesData(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function initializeSalesData(salesData) {
    function displaySalesData(categoryFilter, monthFilter) {
        const salesContainer = document.getElementById('sales-container');
        salesContainer.innerHTML = ''; // Clear any existing content

        let filteredData = salesData.total_sales;

        if (monthFilter && monthFilter !== 'all') {
            filteredData = salesData.monthly_sales.filter(item => item.periode === monthFilter);
        }

        if (categoryFilter && categoryFilter !== 'all') {
            filteredData = filteredData.filter(item => item.Category.toLowerCase() === categoryFilter.toLowerCase());
        }

        filteredData.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'box';

            const icon = document.createElement('div');
            icon.className = 'bx';
            // You can customize this part

            const textContainer = document.createElement('div');
            textContainer.className = 'text';
            textContainer.innerHTML = `
                <h3>${item.total_sales || item.total_quantity}</h3>
                <p>${item.Category}</p>
            `;

            listItem.appendChild(icon);
            listItem.appendChild(textContainer);
            salesContainer.appendChild(listItem);
        });
    }

    // Initial call to display all data
    displaySalesData('all', 'all');

    // Event listener for the filter
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');

    function updateFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedMonth = monthFilter.value;
        displaySalesData(selectedCategory, selectedMonth);
    }

    categoryFilter.addEventListener('change', updateFilters);
    monthFilter.addEventListener('change', updateFilters);
}
