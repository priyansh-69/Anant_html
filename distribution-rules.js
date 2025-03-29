// Utility functions
function validateCondition(row) {
    const field = row.querySelector('.field-select');
    const operator = row.querySelector('.operator-select');
    const value = row.querySelector('.value-input');
    let isValid = true;

    // Clear previous errors
    [field, operator, value].forEach(el => {
        el.classList.remove('error');
        const errorMsg = el.nextElementSibling?.classList.contains('error-message');
        if (errorMsg) errorMsg.remove();
    });

    if (!field.value) {
        field.classList.add('error');
        isValid = false;
    }

    if (!operator.value) {
        operator.classList.add('error');
        isValid = false;
    }

    if (!value.value && !['is empty', 'is not empty'].includes(operator.value)) {
        value.classList.add('error');
        isValid = false;
    }

    return isValid;
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('#rulesTableBody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

function showSuccessFeedback(element) {
    element.classList.add('success-flash');
    setTimeout(() => {
        element.classList.remove('success-flash');
    }, 1000);
}

// Event Handlers
document.getElementById('createRuleBtn').addEventListener('click', function() {
    document.getElementById('ruleForm').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    if (document.getElementById('ruleForm').dataset.editingRow) {
        if (!confirm('Are you sure you want to discard your changes?')) {
            return;
        }
    }
    delete document.getElementById('ruleForm').dataset.editingRow;
    document.getElementById('ruleForm').style.display = 'none';
    document.getElementById('createRuleBtn').style.display = 'block';
});

// Handle match type change
document.querySelectorAll('input[name="matchType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const connector = this.value === 'any' ? 'OR' : 'AND';
        document.querySelectorAll('.condition-prefix').forEach(prefix => {
            if (!prefix.closest('.condition-row').previousElementSibling) {
                prefix.style.visibility = 'hidden'; // Hide first row's prefix
            } else {
                prefix.style.visibility = 'visible';
                prefix.value = connector;
            }
        });
    });
});

// Handle More/Fewer functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('more-btn')) {
        const currentRow = e.target.closest('.condition-row');
        const newRow = document.createElement('div');
        newRow.className = 'condition-row';
        const matchType = document.querySelector('input[name="matchType"]:checked').value;
        const connector = matchType === 'any' ? 'OR' : 'AND';
        
        // Create the new row with initial opacity 0
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        newRow.style.transition = 'all 0.2s ease';
        
        newRow.innerHTML = `
            <select class="condition-prefix" style="width: 70px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: white; color: #374151; font-size: 14px;">
                <option value="AND" ${connector === 'AND' ? 'selected' : ''}>AND</option>
                <option value="OR" ${connector === 'OR' ? 'selected' : ''}>OR</option>
            </select>
            <select class="field-select">
                ${document.querySelector('.field-select').innerHTML}
            </select>
            <select class="operator-select">
                ${document.querySelector('.operator-select').innerHTML}
            </select>
            <input type="text" class="value-input" placeholder="Enter value">
            <button class="fewer-btn">↑ Fewer</button>
        `;
        
        // Insert after the current row
        if (currentRow.nextElementSibling) {
            currentRow.parentNode.insertBefore(newRow, currentRow.nextElementSibling);
        } else {
            currentRow.parentNode.appendChild(newRow);
        }

        // Trigger reflow and animate in
        requestAnimationFrame(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        });

        // Hide first row's prefix
        const firstPrefix = document.querySelector('.condition-row:first-child .condition-prefix');
        if (firstPrefix) {
            firstPrefix.style.visibility = 'hidden';
        }

        // Focus the field select of the new row
        newRow.querySelector('.field-select').focus();
    }
    
    if (e.target.classList.contains('fewer-btn')) {
        const row = e.target.closest('.condition-row');
        const container = document.getElementById('conditionsContainer');
        
        if (container.children.length > 1) {
            // Animate out
            row.style.opacity = '0';
            row.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                row.remove();
                // If we're back to one row, hide its prefix
                if (container.children.length === 1) {
                    container.querySelector('.condition-prefix').style.visibility = 'hidden';
                }
            }, 200);
        }
    }
});

// Initialize first row's prefix visibility
const firstPrefix = document.querySelector('.condition-row:first-child .condition-prefix');
if (firstPrefix) {
    firstPrefix.style.visibility = 'hidden';
}

// Save Rule
document.querySelector('.save-btn').addEventListener('click', function() {
    const conditionRows = document.querySelectorAll('.condition-row');
    let isValid = true;

    // Validate all conditions
    conditionRows.forEach(row => {
        if (!validateCondition(row)) {
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    const conditions = [];
    conditionRows.forEach((row, index) => {
        const field = row.querySelector('.field-select').value;
        const operator = row.querySelector('.operator-select').value;
        const value = row.querySelector('.value-input').value;
        const prefix = index === 0 ? '' : row.querySelector('.condition-prefix').value;
        conditions.push({ field, operator, value, prefix });
    });

    const rulesText = conditions.map((condition, index) => {
        const prefix = index === 0 ? '' : `<span class="${condition.prefix.toLowerCase()}">${condition.prefix}</span>`;
        return `${prefix} ${condition.field} <span class="is">${condition.operator}</span> ${condition.value}`;
    }).join(' ');

    const userValue = document.querySelector('.user-input').value || '-';
    document.getElementById('noRulesMessage').style.display = 'none';
    document.querySelector('.rules-table').style.display = 'block';

    const editingRowIndex = document.getElementById('ruleForm').dataset.editingRow;
    
    if (editingRowIndex) {
        // Update existing row
        const tbody = document.getElementById('rulesTableBody');
        const existingRow = tbody.children[editingRowIndex - 1];
        if (existingRow) {
            existingRow.cells[1].innerHTML = rulesText;
            existingRow.cells[2].textContent = userValue;
            showSuccessFeedback(existingRow);
            delete document.getElementById('ruleForm').dataset.editingRow;
        }
    } else {
        // Create new row
        const currentRules = document.querySelectorAll('#rulesTableBody tr').length;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${currentRules + 1}</td>
            <td>${rulesText}</td>
            <td>${userValue}</td>
            <td><button class="edit-btn">Edit</button></td>
            <td><button class="delete-btn">Delete</button></td>
            <td>
                <button class="order-up">↑</button>
                <button class="order-down">↓</button>
            </td>
        `;
        document.getElementById('rulesTableBody').appendChild(newRow);
        showSuccessFeedback(newRow);
    }

    // Reset form
    document.getElementById('ruleForm').style.display = 'none';
    document.getElementById('createRuleBtn').style.display = 'block';
    
    // Reset form fields
    const conditionsContainer = document.getElementById('conditionsContainer');
    while (conditionsContainer.children.length > 1) {
        conditionsContainer.removeChild(conditionsContainer.lastChild);
    }
    
    const firstRow = conditionsContainer.firstElementChild;
    firstRow.querySelector('.field-select').value = 'Contact Name';
    firstRow.querySelector('.operator-select').value = 'is';
    firstRow.querySelector('.value-input').value = '';
    document.querySelector('.user-input').value = '';
    document.querySelector('input[name="matchType"][value="all"]').checked = true;
    
    // Reset first row prefix visibility
    const firstPrefix = document.querySelector('.condition-row:first-child .condition-prefix');
    if (firstPrefix) {
        firstPrefix.style.visibility = 'hidden';
    }
});

// Delete Rule
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Are you sure you want to delete this rule?')) {
            return;
        }
        
        const row = e.target.closest('tr');
        row.classList.add('loading');
        
        setTimeout(() => {
            row.remove();
            updateRowNumbers();
            
            const rulesTable = document.getElementById('rulesTableBody');
            if (rulesTable.children.length === 0) {
                document.querySelector('.rules-table').style.display = 'none';
                document.getElementById('noRulesMessage').style.display = 'block';
            }
        }, 200);
    }
});

// Handle Order buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('order-up') || e.target.classList.contains('order-down')) {
        const row = e.target.closest('tr');
        const table = document.getElementById('rulesTableBody');
        
        if (e.target.classList.contains('order-up') && row.previousElementSibling) {
            row.classList.add('loading');
            setTimeout(() => {
                table.insertBefore(row, row.previousElementSibling);
                row.classList.remove('loading');
                showSuccessFeedback(row);
                updateRowNumbers();
            }, 200);
        } else if (e.target.classList.contains('order-down') && row.nextElementSibling) {
            row.classList.add('loading');
            setTimeout(() => {
                table.insertBefore(row.nextElementSibling, row);
                row.classList.remove('loading');
                showSuccessFeedback(row);
                updateRowNumbers();
            }, 200);
        }
    }
});

// Open and close modal functionality
document.querySelector('.user-select-btn').addEventListener('click', function() {
    document.getElementById('userModal').style.display = 'block';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('userModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('userModal')) {
        document.getElementById('userModal').style.display = 'none';
    }
});

// Add Edit Rule functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn')) {
        const row = e.target.closest('tr');
        const ruleText = row.cells[1].innerHTML;
        const userValue = row.cells[2].textContent;

        // Show the rule form
        document.getElementById('ruleForm').style.display = 'block';
        document.getElementById('createRuleBtn').style.display = 'none';

        // Parse the rule text to populate the form
        const conditions = ruleText.split(/<span class="(and|or)">(AND|OR)<\/span>/);
        const matchType = ruleText.includes('class="or"') ? 'any' : 'all';
        
        // Set match type radio
        document.querySelector(`input[name="matchType"][value="${matchType}"]`).checked = true;

        // Remove all existing condition rows except the first one
        const conditionsContainer = document.getElementById('conditionsContainer');
        while (conditionsContainer.children.length > 1) {
            conditionsContainer.removeChild(conditionsContainer.lastChild);
        }

        // Helper function to extract field, operator and value from rule text
        function parseCondition(text) {
            const parts = text.trim().split(/<span class="is">([^<]+)<\/span>/);
            return {
                field: parts[0].trim(),
                operator: parts[1] ? parts[1].trim() : 'is',
                value: parts[2] ? parts[2].trim() : ''
            };
        }

        // Parse and set conditions
        const parsedConditions = conditions
            .filter((_, i) => i % 3 === 0) // Get only the condition parts
            .map(c => parseCondition(c.trim()))
            .filter(c => c.field && c.value !== undefined);

        // Set first condition
        if (parsedConditions.length > 0) {
            const firstRow = conditionsContainer.firstElementChild;
            firstRow.querySelector('.field-select').value = parsedConditions[0].field;
            firstRow.querySelector('.operator-select').value = parsedConditions[0].operator;
            firstRow.querySelector('.value-input').value = parsedConditions[0].value;
        }

        // Add additional conditions
        for (let i = 1; i < parsedConditions.length; i++) {
            const newRow = document.createElement('div');
            newRow.className = 'condition-row';
            newRow.innerHTML = `
                <select class="condition-prefix" style="width: 70px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: white; color: #374151; font-size: 14px;">
                    <option value="AND" ${matchType === 'all' ? 'selected' : ''}>AND</option>
                    <option value="OR" ${matchType === 'any' ? 'selected' : ''}>OR</option>
                </select>
                <select class="field-select">
                    ${document.querySelector('.field-select').innerHTML}
                </select>
                <select class="operator-select">
                    ${document.querySelector('.operator-select').innerHTML}
                </select>
                <input type="text" class="value-input" placeholder="Enter value">
                <button class="fewer-btn">↑ Fewer</button>
            `;
            conditionsContainer.appendChild(newRow);

            // Set values
            const currentRow = conditionsContainer.lastElementChild;
            currentRow.querySelector('.field-select').value = parsedConditions[i].field;
            currentRow.querySelector('.operator-select').value = parsedConditions[i].operator;
            currentRow.querySelector('.value-input').value = parsedConditions[i].value;
        }

        // Hide first row's prefix
        const firstPrefix = document.querySelector('.condition-row:first-child .condition-prefix');
        if (firstPrefix) {
            firstPrefix.style.visibility = 'hidden';
        }

        // Set user value
        document.querySelector('.user-input').value = userValue !== '-' ? userValue : '';

        // Store the row being edited
        document.getElementById('ruleForm').dataset.editingRow = row.rowIndex;
    }
}); 