let categoryChart = null;

// Function to generate the chart
function generateCategoryChart(inventory) {
    const categoryCounts = {
        Medicines: 0,
        Equipment: 0,
        Consumables: 0
    };

    inventory.forEach(item => {
        categoryCounts[item.category] += item.quantity;
    });

    // Clear existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }

    const ctx = document.getElementById('reportChart').getContext('2d');
    categoryChart = new Chart(ctx, {
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

// Export function so it can be used in other files
export { generateCategoryChart };
