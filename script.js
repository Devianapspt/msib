document.addEventListener('DOMContentLoaded', function() {
    // pemilihan menu di sidebar
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const sidebar = document.getElementById('sidebar');
    let isSidebarOpen = true; // Variabel untuk melacak status sidebar

    allSideMenu.forEach(item => {
        const li = item.parentElement;

        item.addEventListener('click', function () {
            allSideMenu.forEach(i => {
                i.parentElement.classList.remove('active');
            });
            li.classList.add('active');
        });
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector('#content nav .bx.bx-menu');

    if (menuBar) {
        menuBar.addEventListener('click', function () {
            if (sidebar) {
                isSidebarOpen = !isSidebarOpen; // Toggle status sidebar

                if (isSidebarOpen) {
                    sidebar.classList.remove('hide'); // Hapus kelas hide jika sidebar sedang tersembunyi
                } else {
                    sidebar.classList.add('hide'); // Tambahkan kelas hide jika sidebar sedang terbuka
                }
            }
        });
    }

    




    const filterContainer = document.querySelector('.filter-container');
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');

    function adjustFilterDisplay() {
        if (window.innerWidth <= 576) {
            filterContainer.style.flexDirection = 'column';
            categoryFilter.style.width = '100%';
            monthFilter.style.width = '100%';
        } else {
            filterContainer.style.flexDirection = 'row';
            categoryFilter.style.width = 'auto';
            monthFilter.style.width = 'auto';
        }
    }

    // Adjust filters on initial load
    adjustFilterDisplay();

    // Adjust filters on window resize
    window.addEventListener('resize', adjustFilterDisplay);

    // Function to adjust wrapper layout
    function adjustWrapperDisplay() {
        const wrapperContainer = document.querySelector('.wrapper-container');
        const wrappers = document.querySelectorAll('.wrapper');
        if (wrapperContainer) {
            if (window.innerWidth <= 768) {
                wrapperContainer.style.flexDirection = 'column';
                wrappers.forEach(wrapper => {
                    wrapper.style.width = '100%';
                    wrapper.style.marginBottom = '100%'; // Add some margin between stacked wrappers
                });
            } else {
                wrapperContainer.style.flexDirection = 'row';
                wrappers.forEach(wrapper => {
                    wrapper.style.width = 'auto';
                    wrapper.style.marginBottom = 'auto'; // Remove margin when side by side
                });
            }
        } 
    }

    // Adjust wrappers on initial load
    adjustWrapperDisplay();

    // Adjust wrappers on window resize
    window.addEventListener('resize', adjustWrapperDisplay);



    // Ambil elemen dropdown
    const dataFilter = document.getElementById('data-filter');
    const dashboardContent = document.getElementById('dashboard-content');

    if (dataFilter && dashboardContent) {
        // Event listener untuk perubahan pada dropdown
        dataFilter.addEventListener('change', function() {
            const selectedValue = dataFilter.value;
            console.log("Data yang diminta: " + selectedValue + '.json');

            // Request data sesuai dengan nilai yang dipilih
            requestData(selectedValue);
        });

        // Fungsi untuk meminta data dan memperbarui dashboard
        function requestData(dataType) {
            // Menggunakan XMLHttpRequest atau fetch untuk memuat data JSON
            const xhr = new XMLHttpRequest();
            xhr.open('GET', dataType + '.json', true);
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    // Sukses memuat data
                    const data = JSON.parse(xhr.responseText);

                    // Memperbarui tampilan dashboard
                    renderDashboard(data);
                } else {
                    // Gagal memuat data
                    console.error("Gagal memuat data. Status: " + xhr.status + " - " + xhr.statusText);
                    dashboardContent.innerHTML = '<p>Gagal memuat data. Silakan coba lagi nanti.</p>';
                }
            };
            xhr.onerror = function() {
                console.error("Error koneksi.");
                dashboardContent.innerHTML = '<p>Error koneksi. Silakan periksa koneksi Anda.</p>';
            };
            xhr.send();
        }

        // Fungsi untuk merender data pada dashboard
        function renderDashboard(data) {
            // Contoh cara merender data, bisa disesuaikan sesuai kebutuhan
            dashboardContent.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        // Inisiasi dashboard dengan data awal
        requestData(dataFilter.value);
    }

});
