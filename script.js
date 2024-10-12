// script.js

const inventory = [];
const supplierList = [];
let editingIndex = null; // Keep track of the item being edited
const itemsPerPage = 5; // Number of items to display per page
let currentPage = 1; // Current page number
let sortDirection = {
    name: true,
    quantity: true,
    expiryDate: true,
    supplier: true
}; // Sorting directions

// Function to add new supplier
document.getElementById('supplierForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const supplierName = document.getElementById('supplierName').value;
    const contactInfo = document.getElementById('contact').value;

    // Create a new supplier object
    const newSupplier = {
        name: supplierName,
        contact: contactInfo
    };

    // Add supplier to supplier list and update dropdown
    supplierList.push(newSupplier);
    updateSupplierDropdown();
    this.reset(); // Reset the supplier form after submission
});

// Function to update supplier dropdown
function updateSupplierDropdown() {
    const supplierDropdown = document.getElementById('supplier');
    supplierDropdown.innerHTML = '<option value="">Select a supplier</option>'; // Clear existing options

    supplierList.forEach((supplier) => {
        const option = document.createElement('option');
        option.value = supplier.name;
        option.textContent = supplier.name;
        supplierDropdown.appendChild(option);
    });
}

// Function to add new item to inventory
document.getElementById('inventoryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const supplier = document.getElementById('supplier').value;
    const category = document.getElementById('category').value;

    const newItem = {
        name,
        quantity: parseInt(quantity), // Ensure quantity is a number
        expiryDate,
        supplier,
        category
    };

    if (editingIndex !== null) {
        // Update existing item
        inventory[editingIndex] = newItem;
        editingIndex = null; // Reset editing index
    } else {
        // Add new item
        inventory.push(newItem);
    }

    updateInventoryTable();
    this.reset(); // Reset the inventory form after submission
});

// Function to update inventory table with alerts and pagination
function updateInventoryTable(filteredInventory = inventory) {
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');
    inventoryTableBody.innerHTML = ''; // Clear existing table rows

    // Calculate total pages
    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredInventory.length);

    // Update table rows based on pagination
    for (let i = startIndex; i < endIndex; i++) {
        const item = filteredInventory[i];
        const row = document.createElement('tr');

        // Highlight low stock and expiring items
        if (item.quantity < 10) {
            row.classList.add('low-stock'); // Add low stock class
        }

        const currentDate = new Date();
        const expiryDate = new Date(item.expiryDate);
        if ((expiryDate - currentDate) / (1000 * 60 * 60 * 24) <= 7) {
            row.classList.add('expiring-soon'); // Add expiring soon class
        }

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.expiryDate}</td>
            <td>${item.supplier}</td>
            <td>${item.category}</td>
            <td>
                <button class="edit-btn" onclick="editItem(${i})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${i})">Delete</button>
            </td>
        `;
        inventoryTableBody.appendChild(row);
    }

    updatePaginationControls(totalPages);
}

// Function to update pagination controls
function updatePaginationControls(totalPages) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // Clear existing pagination controls

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = function () {
            currentPage = i; // Set current page to the button's page
            updateInventoryTable(); // Update the table based on the new page
        };
        paginationControls.appendChild(button);
    }
}

// Functions to edit and delete items
function editItem(index) {
    const item = inventory[index];
    document.getElementById('name').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('expiryDate').value = item.expiryDate;
    document.getElementById('supplier').value = item.supplier;
    document.getElementById('category').value = item.category;

    editingIndex = index; // Set the index for editing
}

// Function to delete an item
function deleteItem(index) {
    inventory.splice(index, 1);
    updateInventoryTable();
}

// Sort functionality
function sortInventory(column) {
    const ascending = sortDirection[column];
    inventory.sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
    });

    // Toggle sorting direction for the next sort
    sortDirection[column] = !ascending;
    updateInventoryTable(); // Update the table with sorted inventory
}

// Event listeners for sorting buttons
document.getElementById('sortByName').addEventListener('click', () => sortInventory('name'));
document.getElementById('sortByQuantity').addEventListener('click', () => sortInventory('quantity'));
document.getElementById('sortByExpiry').addEventListener('click', () => sortInventory('expiryDate'));
document.getElementById('sortBySupplier').addEventListener('click', () => sortInventory('supplier'));

// Search and filter functionality
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    filterInventory();
});

// Placeholder for filter options (not fully implemented in the previous code)
document.getElementById('filterOptions').addEventListener('change', function () {
    const selectedFilter = this.value;
    if (selectedFilter === 'specificSupplier') {
        document.getElementById('specificSupplierInput').style.display = 'block';
    } else {
        document.getElementById('specificSupplierInput').style.display = 'none';
        filterInventory();
    }
});

document.getElementById('specificSupplierInput').addEventListener('input', function () {
    filterInventory();
});

function filterInventory() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedFilter = document.getElementById('filterOptions').value;
    const specificSupplierName = document.getElementById('specificSupplierInput').value.toLowerCase();

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
            item.supplier.toLowerCase().includes(searchTerm) ||
            item.expiryDate.includes(searchTerm);

        let matchesFilter = true;

        if (selectedFilter === 'lowStock') {
            matchesFilter = item.quantity < 10; // Define your low stock threshold
        } else if (selectedFilter === 'expiringSoon') {
            const currentDate = new Date();
            const expiryDate = new Date(item.expiryDate);
            matchesFilter = (expiryDate - currentDate) / (1000 * 60 * 60 * 24) <= 7; // Expiring in 7 days or less
        } else if (selectedFilter === 'specificSupplier') {
            matchesFilter = item.supplier.toLowerCase().includes(specificSupplierName);
        }

        return matchesSearch && matchesFilter;
    });

    updateInventoryTable(filteredInventory);
}

// Function to export inventory data to CSV
function exportToCSV() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
        inventory.map(item => `${item.name},${item.quantity},${item.expiryDate},${item.supplier},${item.category}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory_data.csv');
    document.body.appendChild(link); // Required for Firefox

    link.click(); // This will download the data file named "inventory_data.csv"
    document.body.removeChild(link); // Clean up
}

// Event listener for export button
document.getElementById('exportButton').addEventListener('click', exportToCSV);

// Supplier list array to store suppliers
const suppliers = [];

// Add event listener for supplier form submission
document.getElementById('supplierForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const supplierName = document.getElementById('supplierName').value;
    const supplierContact = document.getElementById('supplierContact').value;

    const newSupplier = {
        name: supplierName,
        contact: supplierContact
    };

    suppliers.push(newSupplier);

    // Update the supplier table and dropdown
    updateSupplierTable();
    updateSupplierDropdown();  // Ensure the supplier dropdown is updated

    // Clear the form
    document.getElementById('supplierForm').reset();
});

// Function to update the supplier table
function updateSupplierTable() {
    const supplierTableBody = document.querySelector('#supplierTable tbody');
    supplierTableBody.innerHTML = ''; // Clear the table first

    suppliers.forEach((supplier, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>
                <button class="edit-btn" onclick="editSupplier(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteSupplier(${index})">Delete</button>
            </td>
        `;

        supplierTableBody.appendChild(row);
    });
}

// Function to edit supplier information
function editSupplier(index) {
    const supplier = suppliers[index];
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierContact').value = supplier.contact;

    // Remove the supplier to be updated and wait for new input
    suppliers.splice(index, 1);
    updateSupplierDropdown();  // Update dropdown when supplier is removed or edited
}

// Function to delete supplier
function deleteSupplier(index) {
    suppliers.splice(index, 1);
    updateSupplierTable();
    updateSupplierDropdown();  // Update dropdown when supplier is deleted
}

// Function to update supplier dropdown in inventory form
function updateSupplierDropdown() {
    const supplierDropdown = document.getElementById('supplier');
    supplierDropdown.innerHTML = '<option value="">Select a supplier</option>'; // Reset dropdown

    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.name;
        option.textContent = supplier.name;
        supplierDropdown.appendChild(option);
    });
}
// Function to generate Inventory Summary Report
function generateInventorySummary() {
    let totalStock = 0;
    let expiringSoonItems = [];
    let lowStockItems = [];
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    inventory.forEach(item => {
        totalStock += item.quantity;

        const itemExpiryDate = new Date(item.expiryDate);
        if (item.quantity < 10) {
            lowStockItems.push(item);
        }
        if (itemExpiryDate <= sevenDaysFromNow) {
            expiringSoonItems.push(item);
        }
    });

    const summaryReportDiv = document.getElementById('summaryReport');
    summaryReportDiv.innerHTML = `
        <h4>Inventory Summary</h4>
        <p>Total Stock: ${totalStock}</p>
        <p>Items Expiring Soon: ${expiringSoonItems.length}</p>
        <p>Low Stock Items: ${lowStockItems.length}</p>
    `;

    // Optionally, list the items expiring soon and low stock items
    if (expiringSoonItems.length > 0) {
        summaryReportDiv.innerHTML += `<h5>Expiring Soon:</h5>`;
        expiringSoonItems.forEach(item => {
            summaryReportDiv.innerHTML += `<p>${item.name} (Expiry: ${item.expiryDate})</p>`;
        });
    }

    if (lowStockItems.length > 0) {
        summaryReportDiv.innerHTML += `<h5>Low Stock Items:</h5>`;
        lowStockItems.forEach(item => {
            summaryReportDiv.innerHTML += `<p>${item.name} (Stock: ${item.quantity})</p>`;
        });
    }
}

// Event listener for generating the report
document.getElementById('generateReportBtn').addEventListener('click', generateInventorySummary);
// Function to generate a Bar Chart of items by category
function generateCategoryChart() {
    const categoryCounts = {
        Medicines: 0,
        Equipment: 0,
        Consumables: 0
    };

    inventory.forEach(item => {
        if (categoryCounts[item.category]) {
            categoryCounts[item.category] += item.quantity;
        }
    });

    const ctx = document.getElementById('reportChart').getContext('2d');
    const categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Medicines', 'Equipment', 'Consumables'],
            datasets: [{
                label: 'Stock by Category',
                data: [categoryCounts.Medicines, categoryCounts.Equipment, categoryCounts.Consumables],
                backgroundColor: ['#007bff', '#28a745', '#ffc107'],
                borderColor: ['#007bff', '#28a745', '#ffc107'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// Function to handle CSV file upload
document.getElementById('exportBtn').addEventListener('click', function () {
    // Get the inventory data from the table
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Define PDF title and headers
    doc.setFontSize(18);
    doc.text('Inventory Data Summary', 14, 20);
    doc.setFontSize(12);

    // Create the table header
    const headers = ["Item Name", "Quantity", "Expiry Date", "Supplier", "Category"];
    const data = [];

    // Collect data from the rows
    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        const rowData = [];
        cols.forEach(col => {
            rowData.push(col.innerText);
        });
        data.push(rowData);
    });

    // Add table to the PDF
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        margin: { horizontal: 10 },
    });

    // Save the PDF
    doc.save('inventory_data_summary.pdf');
});


// Event listener for file input (add in your HTML)
document.getElementById('restoreFileInput').addEventListener('change', function (event) {
    restoreInventory(event.target.files[0]);
});

document.addEventListener('DOMContentLoaded', () => {
    const inventory = []; // Array to hold inventory items
    const suppliers = []; // Array to hold suppliers

    // Function to add new item
    document.getElementById('inventoryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const itemName = document.getElementById('name').value;
        const quantity = document.getElementById('quantity').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const supplier = document.getElementById('supplier').value;
        const category = document.getElementById('category').value;

        // Push new item to inventory array
        inventory.push({ itemName, quantity, expiryDate, supplier, category });
        displayInventory();
        this.reset(); // Reset form fields
    });

    // Function to display inventory items
    function displayInventory() {
        const inventoryTableBody = document.querySelector('#inventoryTable tbody');
        inventoryTableBody.innerHTML = ''; // Clear current table

        inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>${item.expiryDate}</td>
                <td>${item.supplier}</td>
                <td>${item.category}</td>
                <td><button class="deleteBtn">Delete</button></td>
            `;
            inventoryTableBody.appendChild(row);
        });

        // Attach delete functionality
        document.querySelectorAll('.deleteBtn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                inventory.splice(index, 1); // Remove item from inventory
                displayInventory(); // Refresh display
            });
        });
    }

    // Additional functions for filtering, exporting, and reporting...
});

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('feedbackMessage');
    feedbackDiv.textContent = message;
    feedbackDiv.className = type === 'success' ? 'feedback-message success' : 'feedback-message error';
    feedbackDiv.style.display = 'block';

    // Hide feedback after 3 seconds
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 3000);
}

