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
            <button class="move-up-subfield" title="Move Up">↑</button>
            <button class="move-down-subfield" title="Move Down">↓</button>
            <a href="#" class="edit-link">Edit</a>
            <a href="#" class="hide-link">Hide</a>
            <a href="#" class="unhide-link" style="display: none;">UnHide</a>
        </div>
    `;

    // Add CSS for the new buttons
    const style = document.createElement('style');
    style.textContent = `
        .move-up-subfield, .move-down-subfield {
            background: none;
            border: none;
            color: #4a5568;
            cursor: pointer;
            padding: 2px 8px;
            margin: 0 2px;
            font-size: 14px;
            transition: color 0.2s;
        }
        .move-up-subfield:hover, .move-down-subfield:hover {
            color: #2d3748;
        }
        .move-up-subfield:disabled, .move-down-subfield:disabled {
            color: #cbd5e0;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

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
    const unhideLink = newFieldRow.querySelector('.unhide-link');
    const moveUpBtn = newFieldRow.querySelector('.move-up-subfield');
    const moveDownBtn = newFieldRow.querySelector('.move-down-subfield');

    // Function to move field up
    function moveFieldUp(field) {
        const previousField = field.previousElementSibling;
        if (previousField) {
            field.parentNode.insertBefore(field, previousField);
            updateMoveButtons(field.parentNode);
        }
    }

    // Function to move field down
    function moveFieldDown(field) {
        const nextField = field.nextElementSibling;
        if (nextField) {
            field.parentNode.insertBefore(nextField, field);
            updateMoveButtons(field.parentNode);
        }
    }

    // Function to update move buttons' disabled state
    function updateMoveButtons(container) {
        const fields = container.querySelectorAll('.field-row.sub-field');
        fields.forEach((field, index) => {
            const upBtn = field.querySelector('.move-up-subfield');
            const downBtn = field.querySelector('.move-down-subfield');
            
            if (upBtn) upBtn.disabled = index === 0;
            if (downBtn) downBtn.disabled = index === fields.length - 1;
        });
    }

    // Add click handlers for move buttons
    moveUpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = e.target.closest('.field-row.sub-field');
        moveFieldUp(field);
    });

    moveDownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = e.target.closest('.field-row.sub-field');
        moveFieldDown(field);
    });

    // Initialize move buttons state
    updateMoveButtons(subFieldsContainer);

    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the current field's data
        const fieldRow = e.target.closest('.field-row');
        const fieldName = fieldRow.querySelector('.field-name').textContent;
        const fieldGroup = fieldRow.closest('.field-group').querySelector('.field-row:not(.sub-field) .field-name').textContent;

        // Show edit field modal
        const editFieldModal = document.getElementById('editFieldModal');
        
        // Populate edit field modal with current values
        document.querySelector('#editGroup').textContent = fieldGroup;
        document.getElementById('editFieldName').value = fieldName;
        
        // Set default values for other fields if they don't exist
        document.querySelector('#editFieldType').textContent = fieldTypeValue || 'Text';
        document.querySelector('#editSearchMode').textContent = searchModeValue || 'ALL';
        document.getElementById('editColumnWidth').value = columnWidth || '150';
        
        // Set checkboxes
        document.getElementById('editIsMandatory').checked = isMandatory || false;
        document.getElementById('editNeedMassEdit').checked = needMassEdit || true;
        document.getElementById('editNeedFieldMapping').checked = needFieldMapping || true;

        // Update dropdown selections
        document.querySelectorAll('#editFieldModal .dropdown-item').forEach(item => {
            const dropdownToggle = item.closest('.dropdown').querySelector('.dropdown-toggle');
            if (dropdownToggle && item.textContent === dropdownToggle.textContent) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        editFieldModal.classList.add('show');
    });

    hideLink.addEventListener('click', (e) => {
        e.preventDefault();
        newFieldRow.querySelector('.field-name').style.textDecoration = 'line-through';
        hideLink.style.display = 'none';
        unhideLink.style.display = 'inline';
    });

    unhideLink.addEventListener('click', (e) => {
        e.preventDefault();
        newFieldRow.querySelector('.field-name').style.textDecoration = 'none';
        hideLink.style.display = 'inline';
        unhideLink.style.display = 'none';
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

    // Update move buttons after adding the new field
    updateMoveButtons(subFieldsContainer);
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
    // Get the updated values
    const newFieldName = document.getElementById('editFieldName').value;
    const newGroup = document.querySelector('#editGroup').textContent;
    const newFieldType = document.querySelector('#editFieldType').textContent;
    const newSearchMode = document.querySelector('#editSearchMode').textContent;
    const newColumnWidth = document.getElementById('editColumnWidth').value;
    const newIsMandatory = document.getElementById('editIsMandatory').checked;
    const newNeedMassEdit = document.getElementById('editNeedMassEdit').checked;
    const newNeedFieldMapping = document.getElementById('editNeedFieldMapping').checked;

    // Find the field being edited
    const activeField = document.querySelector('.field-row.sub-field.editing');
    if (activeField) {
        // Update the field name
        activeField.querySelector('.field-name').textContent = newFieldName;
        
        // Update the checkbox ID if needed
        const checkbox = activeField.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.id = `${newFieldName.replace(/\s+/g, '')}Check`;
        }

        // Remove editing class
        activeField.classList.remove('editing');

        // If group changed, move the field to the new group
        const currentGroup = activeField.closest('.field-group');
        const currentGroupName = currentGroup.querySelector('.field-row:not(.sub-field) .field-name').textContent;
        
        if (newGroup !== currentGroupName) {
            const targetGroup = Array.from(document.querySelectorAll('.field-group')).find(group => 
                group.querySelector('.field-row:not(.sub-field) .field-name').textContent === newGroup
            );
            
            if (targetGroup) {
                let subFieldsContainer = targetGroup.querySelector('.sub-fields');
                if (!subFieldsContainer) {
                    subFieldsContainer = document.createElement('div');
                    subFieldsContainer.classList.add('sub-fields');
                    targetGroup.appendChild(subFieldsContainer);
                }
                subFieldsContainer.appendChild(activeField);
            }
        }
    }

    // Close the modal
    document.getElementById('editFieldModal').classList.remove('show');
});

// Add click handler for edit links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-link')) {
        e.preventDefault();
        
        // Remove editing class from any previously edited field
        document.querySelectorAll('.field-row.sub-field.editing').forEach(field => {
            field.classList.remove('editing');
        });
        
        // Add editing class to current field
        const fieldRow = e.target.closest('.field-row.sub-field');
        if (fieldRow) {
            fieldRow.classList.add('editing');
        }
    }
});

// Add global handler for move buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('move-up-subfield') || e.target.classList.contains('move-down-subfield')) {
        const field = e.target.closest('.field-row.sub-field');
        const container = field.parentNode;
        
        if (e.target.classList.contains('move-up-subfield')) {
            moveFieldUp(field);
        } else {
            moveFieldDown(field);
        }
        
        updateMoveButtons(container);
    }
});

// Function to initialize move buttons for existing fields
function initializeMoveButtons() {
    document.querySelectorAll('.sub-fields').forEach(container => {
        const fields = container.querySelectorAll('.field-row.sub-field');
        fields.forEach((field, index) => {
            // Add move buttons if they don't exist
            if (!field.querySelector('.move-up-subfield')) {
                const actions = field.querySelector('.field-actions');
                const editLink = actions.querySelector('.edit-link');
                
                const moveUpBtn = document.createElement('button');
                moveUpBtn.className = 'move-up-subfield';
                moveUpBtn.title = 'Move Up';
                moveUpBtn.textContent = '↑';
                
                const moveDownBtn = document.createElement('button');
                moveDownBtn.className = 'move-down-subfield';
                moveDownBtn.title = 'Move Down';
                moveDownBtn.textContent = '↓';
                
                actions.insertBefore(moveDownBtn, editLink.nextSibling);
                actions.insertBefore(moveUpBtn, editLink.nextSibling);
            }
        });
        updateMoveButtons(container);
    });
}

// Initialize move buttons when the page loads
document.addEventListener('DOMContentLoaded', initializeMoveButtons);

// Add these functions at the beginning of the file
function moveSubfieldUp(field) {
    const previousField = field.previousElementSibling;
    if (previousField && previousField.classList.contains('sub-field')) {
        field.parentNode.insertBefore(field, previousField);
        updateSubfieldMoveButtons(field.parentNode);
    }
}

function moveSubfieldDown(field) {
    const nextField = field.nextElementSibling;
    if (nextField && nextField.classList.contains('sub-field')) {
        field.parentNode.insertBefore(nextField, field);
        updateSubfieldMoveButtons(field.parentNode);
    }
}

function updateSubfieldMoveButtons(container) {
    const subfields = container.querySelectorAll('.sub-field');
    subfields.forEach((field, index) => {
        const upBtn = field.querySelector('.move-up-subfield');
        const downBtn = field.querySelector('.move-down-subfield');
        
        if (upBtn) upBtn.disabled = index === 0;
        if (downBtn) downBtn.disabled = index === subfields.length - 1;
    });
}

// Add this to your document ready or initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize move buttons state for all subfield containers
    document.querySelectorAll('.sub-fields').forEach(container => {
        updateSubfieldMoveButtons(container);
    });

    // Add click handlers for move buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('move-up-subfield')) {
            e.preventDefault();
            const field = e.target.closest('.sub-field');
            moveSubfieldUp(field);
        } else if (e.target.classList.contains('move-down-subfield')) {
            e.preventDefault();
            const field = e.target.closest('.sub-field');
            moveSubfieldDown(field);
        }
    });
});

// Modified Save Changes handler for creating a new group
document.querySelector('#createGroupModal .btn-ok').addEventListener('click', () => {
    // Get the group name from the modal
    const groupName = document.getElementById('newGroupName').value.trim();
    const columnLayout = document.querySelector('#createGroupModal .dropdown-toggle').textContent.trim();
    
    if (!groupName) {
        alert("Please enter a group name.");
        return;
    }

    // Create new group HTML
    const newGroup = document.createElement('div');
    newGroup.classList.add('field-group');
    newGroup.innerHTML = `
        <div class="field-row">
            <div class="field-checkbox">
                <input type="checkbox" id="${groupName.replace(/\s+/g, '')}Check" />
            </div>
            <div class="field-name">${groupName}</div>
            <div class="field-controls">
                <button class="edit"></button>
                <button class="move-up"></button>
                <button class="move-down"></button>
                <label class="show-default">
                    <input type="checkbox" checked />
                    <span>Show Default</span>
                </label>
            </div>
        </div>
        <div class="sub-fields"></div>
    `;

    // Add the new group to the page
    document.querySelector('.leads-layout').appendChild(newGroup);

    // Add the new group to all group dropdowns
    const dropdownMenus = document.querySelectorAll('.group-dropdown .dropdown-menu');
    dropdownMenus.forEach(menu => {
        const newItem = document.createElement('div');
        newItem.classList.add('dropdown-item');
        newItem.textContent = groupName;
        menu.appendChild(newItem);

        // Add click handler for the new dropdown item
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = menu.closest('.dropdown');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            // Update selected state
            menu.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('selected'));
            newItem.classList.add('selected');
            
            // Update toggle text
            toggle.textContent = groupName;
            
            // Close dropdown
            dropdown.classList.remove('open');
        });
    });

    // Add event listeners to the new group's buttons
    const editButton = newGroup.querySelector('.edit');
    const moveUpButton = newGroup.querySelector('.move-up');
    const moveDownButton = newGroup.querySelector('.move-down');
    const checkbox = newGroup.querySelector('input[type="checkbox"]');

    editButton.addEventListener('click', () => {
        editModal.classList.add('show');
        document.getElementById('groupName').value = groupName;
    });

    moveUpButton.addEventListener('click', () => {
        if (!checkbox.checked) {
            showAlert();
            return;
        }
        const previousGroup = newGroup.previousElementSibling;
        if (previousGroup && previousGroup.classList.contains('field-group')) {
            newGroup.parentNode.insertBefore(newGroup, previousGroup);
        }
    });

    moveDownButton.addEventListener('click', () => {
        if (!checkbox.checked) {
            showAlert();
            return;
        }
        const nextGroup = newGroup.nextElementSibling;
        if (nextGroup && nextGroup.classList.contains('field-group')) {
            newGroup.parentNode.insertBefore(nextGroup, newGroup);
        }
    });

    // Close the modal and reset form
    createGroupModal.classList.remove('show');
    document.getElementById('newGroupName').value = '';
    document.querySelector('#createGroupModal .dropdown-toggle').textContent = 'Two Column';
});

// Add click handler for the Add Group button (folder-plus)
document.querySelector('.folder-plus').addEventListener('click', () => {
    // Reset the create group modal form
    document.getElementById('newGroupName').value = '';
    document.querySelector('#createGroupModal .dropdown-toggle').textContent = 'Two Column';
    createGroupModal.classList.add('show');
});
