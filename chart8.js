// Menunggu sampai seluruh konten DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Mengambil data dari file JSON
    fetch("./topproductavg.json")
      .then((res) => res.json()) // Mengubah respons menjadi format JSON
      .then((data) => {
        // DataTables
        let tableBody = document.getElementById("valSales"); // Mendapatkan elemen tbody dari tabel produk
  
        // Mengisi tabel dengan data dari file JSON
        data.forEach(function (item) {
          let row = document.createElement("tr"); // Membuat elemen baris baru
  
          // Menambahkan data produk ke dalam baris
          row.innerHTML = `
                  <td>${item.product}</td>
                  <td>${item.category}</td>
                  <td>${item.Average_Quantity}</td>
              `;
  
          // Menambahkan baris ke dalam tabel
          tableBody.appendChild(row);
        });
  
        // Menginisialisasi DataTables pada tabel produk
        $("#topCategoriesTable2").DataTable();
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
});
