// js/dashboard.js

export function loadDashboard() {
    const dashboardContainer = document.getElementById('dashboard');

    // Clear the container
    dashboardContainer.innerHTML = '';

    // Load different sections
    dashboardContainer.appendChild(createInventorySection());
    dashboardContainer.appendChild(createSupplierSection());
    dashboardContainer.appendChild(createReportSection());
}

function createInventorySection() {
    const inventorySection = document.createElement('div');
    inventorySection.classList.add('dashboard-section');
    inventorySection.innerHTML = `
        <h2>Inventory</h2>
        <form id="inventoryForm">
            <input type="text" id="name" placeholder="Item Name" required />
            <input type="number" id="quantity" placeholder="Quantity" required />
            <input type="date" id="expiryDate" required />
            <select id="supplier" required>
                <option value="">Select a supplier</option>
                <!-- Supplier options will be dynamically generated -->
            </select>
            <input type="text" id="category" placeholder="Category" required />
            <button type="submit">Add Item</button>
        </form>
        <table id="inventoryTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Inventory items will be appended here -->
            </tbody>
        </table>
    `;

    // Handle form submission
    inventorySection.querySelector('#inventoryForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const item = {
            name: document.getElementById('name').value,
            quantity: parseInt(document.getElementById('quantity').value),
            expiryDate: document.getElementById('expiryDate').value,
            supplier: document.getElementById('supplier').value,
            category: document.getElementById('category').value,
        };
        addInventoryItem(item); // Assuming this function is imported
        event.target.reset();
    });

    return inventorySection;
}

function createSupplierSection() {
    const supplierSection = document.createElement('div');
    supplierSection.classList.add('dashboard-section');
    supplierSection.innerHTML = `
        <h2>Suppliers</h2>
        <form id="supplierForm">
            <input type="text" id="supplierName" placeholder="Supplier Name" required />
            <input type="text" id="supplierContact" placeholder="Contact" required />
            <button type="submit">Add Supplier</button>
        </form>
        <select id="supplier">
            <option value="">Select a supplier</option>
            <!-- Suppliers will be dynamically generated -->
        </select>
    `;

    // Handle supplier form submission
    supplierSection.querySelector('#supplierForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const supplier = {
            name: document.getElementById('supplierName').value,
            contact: document.getElementById('supplierContact').value,
        };
        addSupplier(supplier); // Assuming this function is imported
        event.target.reset();
    });

    return supplierSection;
}

function createReportSection() {
    const reportSection = document.createElement('div');
    reportSection.classList.add('dashboard-section');
    reportSection.innerHTML = `
        <h2>Reports</h2>
        <button id="generateReport">Generate Report</button>
        <div id="summaryReport"></div>
        <canvas id="reportChart" width="400" height="200"></canvas>
    `;

    reportSection.querySelector('#generateReport').addEventListener('click', () => {
        generateInventorySummary(inventory); // Assuming this function is imported
        generateCategoryChart(inventory); // Assuming this function is imported
    });

    return reportSection;
}
