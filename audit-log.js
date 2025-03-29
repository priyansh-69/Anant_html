// Sample data
const sampleData = [
    { 
        user: 'P.TEJAVATHI',
        screen: 'Leads',
        activity: 'Created',
        details: '',
        device: 'Mobile',
        time: '28-Mar-2025 12:10 PM',
        location: '25.01.01,Android,12,220733SI,Xiaomi,bb0e94f281fd75d7',
        createdTime: '28-Mar-2025 12:10 PM',
        modifiedTime: '28-Mar-2025 12:10 PM',
        lastViewedTime: '28-Mar-2025 12:10 PM'
    }
];

function populateTable(data) {
    const tbody = document.getElementById('auditTableBody');
    tbody.innerHTML = data.map((row, index) => `
        <tr data-index="${index}" class="clickable-row">
            <td class="checkbox-col">
                <input type="checkbox" />
            </td>
            <td>${row.user}</td>
            <td>${row.screen}</td>
            <td>${row.activity}</td>
            <td>${row.details}</td>
            <td>${row.device}</td>
            <td>${row.time}</td>
            <td>${row.location}</td>
        </tr>
    `).join('');

    // Add click event listeners to rows
    document.querySelectorAll('.clickable-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                const index = row.dataset.index;
                showDetailView(data[index]);
            }
        });
    });
}

function showDetailView(data) {
    // Hide list view and show detail view
    document.getElementById('listView').style.display = 'none';
    document.getElementById('detailView').style.display = 'block';

    // Populate detail view
    document.getElementById('detailUser').textContent = data.user;
    document.getElementById('detailScreen').textContent = data.screen;
    document.getElementById('detailActivity').textContent = data.activity;
    document.getElementById('detailDetails').textContent = data.details || '-';
    document.getElementById('detailDevice').textContent = data.device;
    document.getElementById('detailPerformedAt').textContent = data.time;
    document.getElementById('detailLocation').textContent = data.location;
    document.getElementById('detailCreatedTime').textContent = data.createdTime;
    document.getElementById('detailModifiedTime').textContent = data.modifiedTime;
    document.getElementById('detailLastViewedTime').textContent = data.lastViewedTime;
}

// Initialize table
populateTable(sampleData);

// Handle back button click
document.querySelector('.back-button').addEventListener('click', () => {
    document.getElementById('detailView').style.display = 'none';
    document.getElementById('listView').style.display = 'block';
});

// Handle refresh button click
document.querySelector('.refresh-btn').addEventListener('click', function() {
    this.classList.add('spinning');
    setTimeout(() => {
        this.classList.remove('spinning');
        populateTable(sampleData);
    }, 1000);
});

// Handle search input
document.querySelector('.search-box input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = sampleData.filter(row => 
        Object.values(row).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        )
    );
    populateTable(filteredData);
}); 