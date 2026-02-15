document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        populateDashboard(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function populateDashboard(data) {
    // Populate metrics cards
    const metricsContainer = document.querySelector('.metrics-cards');
    if (data.metrics && metricsContainer) {
        data.metrics.forEach(metric => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${metric.title}</h3><p>${metric.value}</p>`;
            metricsContainer.appendChild(card);
        });
    }

    // Populate data table
    const tableBody = document.querySelector('.data-table tbody');
    if (data.transactions && tableBody) {
        data.transactions.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tx.id}</td>
                <td>${tx.product}</td>
                <td>${tx.date}</td>
                <td>$${tx.amount.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Integración de la llamada al gráfico
        renderChart(data.transactions);
    }
}

// Nueva función integrada para el gráfico
function renderChart(transactions) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Procesar datos: Agrupar montos por nombre de producto
    const totals = {};
    transactions.forEach(tx => {
        totals[tx.product] = (totals[tx.product] || 0) + tx.amount;
    });

    const labels = Object.keys(totals);
    const amounts = Object.values(totals);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas por Producto ($)',
                data: amounts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
