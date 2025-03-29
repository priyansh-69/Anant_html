// Navigation functionality
document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".main-nav a").forEach((a) => a.classList.remove("active"));
        this.classList.add("active");
        if (this.getAttribute("href") !== "#") {
            window.location.href = this.getAttribute("href");
        }
    });
});

// Modal functionality
const editModal = document.getElementById('editGroupModal');
const createFieldModal = document.getElementById('createFieldModal');
const createGroupModal = document.getElementById('createGroupModal');
const editButtons = document.querySelectorAll('.edit');
const addFieldButton = document.querySelector('.add-field');
const addGroupButton = document.querySelector('.folder-plus');
const cancelButtons = document.querySelectorAll('.btn-cancel');
const okButtons = document.querySelectorAll('.btn-ok');
const saveButton = createFieldModal.querySelector('.btn-save');

// Show edit modal when edit button is clicked
editButtons.forEach(button => {
    button.addEventListener('click', () => {
        editModal.classList.add('show');
    });
});

// Show create field modal when Add Field button is clicked
addFieldButton.addEventListener('click', () => {
    createFieldModal.classList.add('show');
});

// Show create group modal when folder-plus icon is clicked
addGroupButton.addEventListener('click', () => {
    createGroupModal.classList.add('show');
});

// Hide modals when cancel is clicked
cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
        editModal.classList.remove('show');
        createFieldModal.classList.remove('show');
        createGroupModal.classList.remove('show');
    });
});

// Hide modals when OK is clicked
okButtons.forEach(button => {
    button.addEventListener('click', () => {
        editModal.classList.remove('show');
        createGroupModal.classList.remove('show');
    });
});

// Modified Save Changes handler for creating a new field
saveButton.addEventListener('click', () => {
    // Retrieve the input values from the modal
    const fieldGroupValue = document.querySelector('#fieldGroup').textContent.trim();
    const fieldNameValue = document.getElementById('fieldName').value.trim();
    const fieldTypeValue = document.querySelector('#fieldType').textContent.trim();
    const searchModeValue = document.querySelector('#searchMode').textContent.trim();
    const isMandatory = document.getElementById('isMandatory').checked;
    const needMassEdit = document.getElementById('needMassEdit').checked;
    const needFieldMapping = document.getElementById('needFieldMapping').checked;
    const columnWidth = document.getElementById('columnWidth').value.trim();
    
    // Validate required fields
    if (!fieldNameValue) {
        alert("Please enter a field name.");
        return;
    }

    if (!fieldGroupValue) {
        alert("Please select a group.");
        return;
    }

    // Find the target group container
    let targetGroup = null;
    document.querySelectorAll('.field-group').forEach(group => {
        const headerField = group.querySelector('.field-row:not(.sub-field) .field-name');
        if (headerField && headerField.textContent.trim() === fieldGroupValue) {
            targetGroup = group;
        }
    });

    if (!targetGroup) {
        alert("Selected group not found. Please select a valid group.");
        return;
    }

    // Create a new field row element
    const newFieldRow = document.createElement('div');
    newFieldRow.classList.add('field-row', 'sub-field');
    newFieldRow.innerHTML = `
        <div class="field-checkbox">
            <input type="checkbox" id="${fieldNameValue.replace(/\s+/g, '')}Check" />
        </div>
        <div class="field-name">${fieldNameValue}</div>
        <div class="field-actions">
            <a href="#" class="edit-link">Edit</a>
            <a href="#" class="hide-link">Hide</a>
        </div>
    `;

    // Find the sub-fields container
    let subFieldsContainer = targetGroup.querySelector('.sub-fields');
    if (!subFieldsContainer) {
        subFieldsContainer = document.createElement('div');
        subFieldsContainer.classList.add('sub-fields');
        targetGroup.appendChild(subFieldsContainer);
    }

    // Add the new field
    subFieldsContainer.appendChild(newFieldRow);

    // Add event listeners to the new field's controls
    const editLink = newFieldRow.querySelector('.edit-link');
    const hideLink = newFieldRow.querySelector('.hide-link');

    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        editFieldModal.classList.add('show');
        
        // Populate edit field modal
        document.querySelector('#editGroup').textContent = fieldGroupValue;
        document.getElementById('editFieldName').value = fieldNameValue;
        document.querySelector('#editFieldType').textContent = fieldTypeValue;
        document.querySelector('#editSearchMode').textContent = searchModeValue;
        document.getElementById('editColumnWidth').value = columnWidth;
        
        // Update checkboxes
        document.getElementById('editIsMandatory').checked = isMandatory;
        document.getElementById('editNeedMassEdit').checked = needMassEdit;
        document.getElementById('editNeedFieldMapping').checked = needFieldMapping;
    });

    hideLink.addEventListener('click', (e) => {
        e.preventDefault();
        newFieldRow.style.display = 'none';
    });

    // Close and reset the create field modal
    createFieldModal.classList.remove('show');
    document.getElementById('fieldName').value = "";
    document.getElementById('isMandatory').checked = false;
    document.getElementById('needMassEdit').checked = true;
    document.getElementById('needFieldMapping').checked = true;
    document.getElementById('columnWidth').value = "150";
    
    // Reset dropdowns
    document.querySelector('#fieldType').textContent = "Text";
    document.querySelector('#searchMode').textContent = "ALL";
});

// Hide modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('show');
    }
    if (e.target === createFieldModal) {
        createFieldModal.classList.remove('show');
    }
    if (e.target === createGroupModal) {
        createGroupModal.classList.remove('show');
    }
});

// Dropdown functionality
function initializeDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = dropdown.querySelectorAll('.dropdown-item');

        if (!toggle || !menu || !items.length) return;

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                }
            });
            
            dropdown.classList.toggle('open');
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const selected = item.textContent.trim();
                
                // Update selected state
                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                
                // Update toggle text
                toggle.textContent = selected;
                
                // Close dropdown
                dropdown.classList.remove('open');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
}

// Initialize dropdowns when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
    
    // Add click event listener to the Add Field button
    addFieldButton.addEventListener('click', () => {
        createFieldModal.classList.add('show');
        
        // Reset form fields
        document.getElementById('fieldName').value = "";
        document.getElementById('isMandatory').checked = false;
        document.getElementById('needMassEdit').checked = true;
        document.getElementById('needFieldMapping').checked = true;
        document.getElementById('columnWidth').value = "150";
        
        // Reset dropdowns to default values
        const fieldGroupToggle = document.querySelector('#fieldGroup');
        const fieldTypeToggle = document.querySelector('#fieldType');
        const searchModeToggle = document.querySelector('#searchMode');
        
        if (fieldGroupToggle) fieldGroupToggle.textContent = "Lead Title";
        if (fieldTypeToggle) fieldTypeToggle.textContent = "Text";
        if (searchModeToggle) searchModeToggle.textContent = "ALL";
        
        // Update selected states in dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const items = dropdown.querySelectorAll('.dropdown-item');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            items.forEach(item => {
                item.classList.remove('selected');
                if (item.textContent === toggle.textContent) {
                    item.classList.add('selected');
                }
            });
        });
    });
});

// Alert Modal functionality
const alertHTML = `
    <div class="modal alert-modal" id="alertModal">
        <div class="modal-content">
            <h2 class="alert-title">Alert</h2>
            <p class="alert-message">Field must be selected</p>
            <div class="modal-actions">
                <button class="btn-ok">Ok</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', alertHTML);

// Get all arrow buttons
const moveUpButtons = document.querySelectorAll('.move-up');
const moveDownButtons = document.querySelectorAll('.move-down');
const alertModal = document.getElementById('alertModal');

// Function to show alert
function showAlert() {
    alertModal.classList.add('show');
}

// Add click handlers for move up buttons
moveUpButtons.forEach(button => {
    button.addEventListener('click', () => {
        const fieldRow = button.closest('.field-row');
        const checkbox = fieldRow.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) {
            showAlert();
        }
    });
});

// Add click handlers for move down buttons
moveDownButtons.forEach(button => {
    button.addEventListener('click', () => {
        const fieldRow = button.closest('.field-row');
        const checkbox = fieldRow.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) {
            showAlert();
        }
    });
});

// Close alert modal when clicking OK
alertModal.querySelector('.btn-ok').addEventListener('click', () => {
    alertModal.classList.remove('show');
});

// Close alert modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        alertModal.classList.remove('show');
    }
});

// Edit functionality
const groupEditButtons = document.querySelectorAll('.field-controls .edit');
const fieldEditLinks = document.querySelectorAll('.edit-link');
const editFieldModal = document.getElementById('editFieldModal');
const editGroupModal = document.getElementById('editGroupModal');

// Handle group edit button clicks
groupEditButtons.forEach(button => {
    button.addEventListener('click', () => {
        const fieldGroup = button.closest('.field-group');
        const groupName = fieldGroup.querySelector('.field-name').textContent;
        
        // Populate edit group modal
        document.getElementById('groupName').value = groupName;
        
        // Show edit group modal
        editGroupModal.classList.add('show');
    });
});

// Handle field edit link clicks
fieldEditLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const fieldRow = link.closest('.field-row');
        const fieldName = fieldRow.querySelector('.field-name').textContent;
        const groupName = fieldRow.closest('.field-group').querySelector('.field-row:not(.sub-field) .field-name').textContent;
        
        // Populate edit field modal
        const groupToggle = document.querySelector('#editGroup');
        groupToggle.textContent = groupName;
        document.querySelectorAll('.group-dropdown .dropdown-item').forEach(item => {
            item.classList.remove('selected');
            if (item.textContent === groupName) {
                item.classList.add('selected');
            }
        });
        
        document.getElementById('editFieldName').value = fieldName;
        document.getElementById('editFieldType').value = 'Email ID';
        
        // Set default selected item in search mode dropdown
        const searchModeToggle = document.querySelector('#editSearchMode');
        searchModeToggle.textContent = 'ALL';
        document.querySelectorAll('.search-mode-dropdown .dropdown-item').forEach(item => {
            item.classList.remove('selected');
            if (item.textContent === 'ALL') {
                item.classList.add('selected');
            }
        });
        
        document.getElementById('editColumnWidth').value = '150';
        
        // Show edit field modal
        editFieldModal.classList.add('show');
    });
});

// Handle save changes in edit field modal
editFieldModal.querySelector('.btn-save').addEventListener('click', () => {
    editFieldModal.classList.remove('show');
});

// Handle cancel in edit field modal
editFieldModal.querySelector('.btn-cancel').addEventListener('click', () => {
    editFieldModal.classList.remove('show');
});

// Close edit field modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editFieldModal) {
        editFieldModal.classList.remove('show');
    }
});
