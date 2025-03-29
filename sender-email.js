// Utility Functions
function showSuccessFeedback(element) {
    element.classList.add('success-flash');
    setTimeout(() => {
        element.classList.remove('success-flash');
    }, 1000);
}

function updateTableVisibility() {
    const hasRows = document.getElementById('senderTableBody').children.length > 0;
    document.querySelector('.sender-table').style.display = hasRows ? 'table' : 'none';
    document.getElementById('noDataMessage').style.display = hasRows ? 'none' : 'block';
}

// Event Listeners
document.getElementById('newSenderBtn').addEventListener('click', function() {
    document.getElementById('senderModal').style.display = 'block';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('senderModal').style.display = 'none';
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('senderModal').style.display = 'none';
});

document.getElementById('senderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fromName = document.getElementById('fromName').value;
    const fromAddress = document.getElementById('fromAddress').value;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${fromName}</td>
        <td>${fromAddress}</td>
        <td><span class="status-badge status-pending">Pending Verification</span></td>
        <td><button class="resend-btn">Resend</button></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    
    document.getElementById('senderTableBody').appendChild(newRow);
    showSuccessFeedback(newRow);
    updateTableVisibility();
    
    // Reset and close form
    this.reset();
    document.getElementById('senderModal').style.display = 'none';
});

// Handle Delete
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Are you sure you want to delete this sender email?')) {
            return;
        }
        
        const row = e.target.closest('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            row.remove();
            updateTableVisibility();
        }, 200);
    }
});

// Handle Resend
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('resend-btn')) {
        const row = e.target.closest('tr');
        const statusBadge = row.querySelector('.status-badge');
        
        // Simulate resending verification
        statusBadge.className = 'status-badge status-pending';
        statusBadge.textContent = 'Pending Verification';
        
        e.target.disabled = true;
        setTimeout(() => {
            e.target.disabled = false;
        }, 2000);
        
        showSuccessFeedback(row);
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('senderModal')) {
        document.getElementById('senderModal').style.display = 'none';
    }
});

// Initialize table visibility
updateTableVisibility(); 