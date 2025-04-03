// Show search section
function showSearch() {
  document.getElementById("searchSection").style.display = "block";
  document.getElementById("searchBtn").style.display = "none";
  document.getElementById("basicSearch").style.display = "block";
  document.getElementById("advancedSearch").style.display = "none";
}

// Toggle between basic and advanced search
function toggleSearchType(type) {
  const basicBtn = document.getElementById("basicSearchBtn");
  const advancedBtn = document.getElementById("advancedSearchBtn");
  const basicSearch = document.getElementById("basicSearch");
  const advancedSearch = document.getElementById("advancedSearch");

  if (type === "basic") {
    basicBtn.classList.add("active");
    advancedBtn.classList.remove("active");
    basicSearch.style.display = "block";
    advancedSearch.style.display = "none";
  } else {
    basicBtn.classList.remove("active");
    advancedBtn.classList.add("active");
    basicSearch.style.display = "none";
    advancedSearch.style.display = "block";
  }
}

// Add event listeners for match type radio buttons
document.addEventListener('DOMContentLoaded', () => {
  const matchTypeRadios = document.querySelectorAll('input[name="matchType"]');
  matchTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const prefixType = e.target.value === 'all' ? 'AND' : 'OR';
      const prefixSelects = document.querySelectorAll('.condition-prefix');
      prefixSelects.forEach(select => {
        select.value = prefixType;
        // Disable the prefix selection when there's only one condition
        if (document.querySelectorAll('.condition-row').length === 1) {
          select.disabled = true;
        }
      });
    });
  });
});

// Modify addConditionRow to set the correct prefix based on current match type
function addConditionRow() {
  const container = document.getElementById("conditionsContainer");
  const rows = container.getElementsByClassName("condition-row");
  const firstRow = rows[0];

  const newRow = firstRow.cloneNode(true);
  newRow.querySelector(".value-input").value = "";

  // Set the prefix based on current match type
  const matchType = document.querySelector('input[name="matchType"]:checked').value;
  const prefixSelect = newRow.querySelector(".condition-prefix");
  prefixSelect.value = matchType === 'all' ? 'AND' : 'OR';
  prefixSelect.disabled = false;  // Enable prefix selection for additional rows

  const deleteBtn = newRow.querySelector(".delete-btn");
  deleteBtn.style.display = "block";

  container.appendChild(newRow);

  if (rows.length > 0) {
    Array.from(rows).forEach((row) => {
      row.querySelector(".delete-btn").style.display = "block";
      // Enable prefix selection for all rows except the first one
      const prefix = row.querySelector(".condition-prefix");
      prefix.disabled = rows.length === 1;
    });
  }

  if (rows.length === 1) {
    rows[0].querySelector(".delete-btn").style.display = "none";
    // Disable prefix selection for the first row when it's alone
    rows[0].querySelector(".condition-prefix").disabled = true;
  }
}

// Delete condition row
function deleteConditionRow(button) {
  const container = document.getElementById("conditionsContainer");
  const rows = container.getElementsByClassName("condition-row");

  if (rows.length === 1) {
    return;
  }

  const row = button.closest(".condition-row");
  row.remove();

  if (rows.length === 1) {
    rows[0].querySelector(".delete-btn").style.display = "none";
  }
}

// Pagination functions
function changeRecordsPerPage(value) {
  // Implement the logic to change records per page
  console.log("Records per page changed to:", value);
}

function goToFirstPage() {
  // Implement first page logic
  console.log("Going to first page");
}

function goToPreviousPage() {
  // Implement previous page logic
  console.log("Going to previous page");
}

function goToNextPage() {
  // Implement next page logic
  console.log("Going to next page");
}

function goToLastPage() {
  // Implement last page logic
  console.log("Going to last page");
}

// Search function
function performSearch() {
  const isAdvancedSearch =
    document.getElementById("advancedSearch").style.display !== "none";

  if (isAdvancedSearch) {
    performAdvancedSearch();
  } else {
    performBasicSearch();
  }
}


function performAdvancedSearch() {
const matchType = document.querySelector('input[name="matchType"]:checked').value;
const conditions = [];

// Collect all conditions from the form
document.querySelectorAll(".condition-row").forEach(row => {
  const condition = {
      field: row.querySelector(".field-select").value,
      operator: row.querySelector(".operator-select").value,
      value: row.querySelector(".value-input").value
  };
  if (condition.value) conditions.push(condition);
});

if (conditions.length === 0) {
  // If no conditions, show all data
  filteredData = [...auditLogData];
} else {
  // Filter data based on conditions
  filteredData = auditLogData.filter(log => {
      const results = conditions.map(condition => {
          const logValue = getAdvancedSearchLogValue(log, condition.field).toString().toLowerCase();
          const conditionValue = condition.value.toString().toLowerCase();
          
          switch(condition.operator) {
              case 'is': 
                  return logValue === conditionValue;
              case 'contains':
                  return logValue.includes(conditionValue);
              case 'starts_with':
                  return logValue.startsWith(conditionValue);
              case 'ends_with':
                  return logValue.endsWith(conditionValue);
              case 'before':
                  return compareDates(log, condition.field, condition.value, 'before');
              case 'after':
                  return compareDates(log, condition.field, condition.value, 'after');
              default:
                  return false;
          }
      });
      
      return matchType === 'all' ? results.every(Boolean) : results.some(Boolean);
  });
}

currentPage = 1;
populateAuditLogTable();
}

function getAdvancedSearchLogValue(log, field) {
switch(field) {
  case 'User': return log.User;
  case 'Screen Name': return log.ScreenName;
  case 'Activity': return log.Activity;
  case 'Device': return log.Device;
  case 'Performed At': return log.Performedat;
  case 'Location': return log.Location;
  default: return '';
}
}




// Format date for comparison (dd-mmm-yyyy to yyyy-mm-dd)
function formatDateForComparison(dateString) {
if (!dateString.includes('-')) return dateString;

const parts = dateString.split('-');
if (parts.length !== 3) return dateString;

const months = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

const day = parts[0].padStart(2, '0');
const month = months[parts[1]] || '01';
const year = parts[2];

return `${year}-${month}-${day}`;
}

function addConditionRow() {
const container = document.getElementById("conditionsContainer");
const firstRow = container.querySelector(".condition-row");

const newRow = firstRow.cloneNode(true);
newRow.querySelector(".value-input").value = "";

// Set the prefix based on current match type
const matchType = document.querySelector('input[name="matchType"]:checked').value;
const prefixSelect = newRow.querySelector(".condition-prefix");
prefixSelect.value = matchType === 'all' ? 'AND' : 'OR';

container.appendChild(newRow);

// Update delete button visibility
updateConditionRowButtons();
}
// Function to add new condition row
function addConditionRow() {
const container = document.getElementById("conditionsContainer");
const firstRow = container.querySelector(".condition-row");

const newRow = firstRow.cloneNode(true);
newRow.querySelector(".value-input").value = "";

// Set the prefix based on current match type
const matchType = document.querySelector('input[name="matchType"]:checked').value;
const prefixSelect = newRow.querySelector(".condition-prefix");
prefixSelect.value = matchType === 'all' ? 'AND' : 'OR';

container.appendChild(newRow);

// Update delete button visibility
updateConditionRowButtons();
}

// Function to remove condition row
function deleteConditionRow(button) {
const container = document.getElementById("conditionsContainer");
const rows = container.querySelectorAll(".condition-row");

if (rows.length <= 1) return; // Don't remove the last row

button.closest(".condition-row").remove();
updateConditionRowButtons();
}

// Update condition row buttons visibility
function updateConditionRowButtons() {
const rows = document.querySelectorAll(".condition-row");
rows.forEach((row, index) => {
  const deleteBtn = row.querySelector(".delete-btn");
  if (deleteBtn) {
      deleteBtn.style.display = rows.length > 1 ? "block" : "none";
  }
});
}

// Update operator options based on field selection
document.addEventListener("change", function(e) {
if (e.target.classList.contains("field-select")) {
  const operatorSelect = e.target.closest(".condition-row").querySelector(".operator-select");
  const field = e.target.value;
  
  operatorSelect.innerHTML = '';
  
  // Common operators for all fields
  const commonOperators = [
      {value: "is", text: "is"},
      {value: "contains", text: "contains"},
      {value: "starts_with", text: "starts with"},
      {value: "ends_with", text: "ends with"}
  ];
  
  // Additional operators for date fields
  if (field === "Performed At") {
      commonOperators.push(
          {value: "before", text: "before"},
          {value: "after", text: "after"}
      );
  }
  
  // Add operators to select
  commonOperators.forEach(op => {
      operatorSelect.add(new Option(op.text, op.value));
  });
}
});

function getColumnIndex(label) {
  const headers = document.querySelectorAll(".table-section table th");
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].textContent.trim() === label) {
      return i;
    }
  }
  return -1;
}

function getColumnIndexByField(field) {
  const fieldToColumnMap = {
    username: 1, // User column
    action: 2, // Action column
    module: 3, // Module column
    date: 0, // Date & Time column
    ip: 5, // IP Address column
    description: 4, // Description column
  };
  return fieldToColumnMap[field] || -1;
}

function cancelSearch() {
  resetFilters();
}

// Update operator options based on field selection
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("field-select")) {
    const operatorSelect =
      e.target.parentElement.querySelector(".operator-select");
    const field = e.target.value;

    // Clear existing options
    operatorSelect.innerHTML = "";

    // Add appropriate operators based on field type
    if (field === "date") {
      [
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "between",
      ].forEach((op) => {
        const option = new Option(op.replace("_", " "), op);
        operatorSelect.add(option);
      });
    } else if (field === "action" || field === "module") {
      ["equals", "not_equals", "in", "not_in"].forEach((op) => {
        const option = new Option(op.replace("_", " "), op);
        operatorSelect.add(option);
      });
    } else {
      [
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "starts_with",
        "ends_with",
      ].forEach((op) => {
        const option = new Option(op.replace("_", " "), op);
        operatorSelect.add(option);
      });
    }
  }
});

// Audit log data array
const auditLogData = [

{
User: "Indhu",
ScreenName: "Leads",
Activity: "Updated",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:20 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "Charitha.D",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:20 PM",
Location: ", 25.01.01,Android,14,SM-E135F,samsung,93e82d48191c79b2"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Updated",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:20 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "P.TEJAVATHI",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:19 PM",
Location: ", 25.01.01,Android,12,220733SI,Xiaomi,bb0e94f28ffd75d7"
},
{
User: "Lavanya",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:19 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,d6f8c1cffa3d8569"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:19 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "P.TEJAVATHI",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:18 PM",
Location: ", 25.01.01,Android,12,220733SI,Xiaomi,bb0e94f28ffd75d7"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:16 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "Charitha.D",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:14 PM",
Location: ", 25.01.01,Android,14,SM-E135F,samsung,93e82d48191c79b2"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:14 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Updated",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:13 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "Charitha.D",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:13 PM",
Location: ", 25.01.01,Android,14,SM-E135F,samsung,93e82d48191c79b2"
},
{
User: "Indhu",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:12 PM",
Location: ", 25.01.01,Android,14,RMX3933,realme,62f92ff45915913b"
},
{
User: "P.TEJAVATHI",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 03:12 PM",
Location: ", 25.01.01,Android,12,220733SI,Xiaomi,bb0e94f28ffd75d7"
},
{
User: "Charitha.D",
ScreenName: "Leads",
Activity: "Created",
Details: "",
Device: "Mobile",
Performedat: "02-Apr-2025 01:35 PM",
Location: ", 25.01.01,Android,14,SM-E135F,samsung,93e82d48191c79b2"
},


];

let filteredData = [...auditLogData];
let currentPage = 1;
let recordsPerPage = 50;

// Function to populate the table with filtered data
function populateAuditLogTable(data = filteredData) {
const tableBody = document.getElementById('auditLogTableBody');
tableBody.innerHTML = '';

const startIndex = (currentPage - 1) * recordsPerPage;
const endIndex = startIndex + recordsPerPage;
const paginatedData = data.slice(startIndex, endIndex);

paginatedData.forEach(log => {
const row = document.createElement('tr');
row.innerHTML = `
<td>${log.Performedat}</td>
<td>${log.User}</td>
<td>${log.Activity}</td>
<td>${log.ScreenName}</td>
<td>${log.Details}</td>
<td>${log.Device}</td>
<td>${log.Location}</td>
`;
tableBody.appendChild(row);
});

updatePaginationInfo(data.length);
}

// Update pagination information
function updatePaginationInfo(totalRecords) {
  const startRecord = ((currentPage - 1) * recordsPerPage) + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);
  document.querySelector('.pagination-info').textContent = 
    `${startRecord} - ${endRecord} / ${totalRecords}`;
}

// Pagination functions
function changeRecordsPerPage(value) {
  recordsPerPage = parseInt(value);
  currentPage = 1;
  populateAuditLogTable();
}

function goToFirstPage() {
  currentPage = 1;
  populateAuditLogTable();
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    populateAuditLogTable();
  }
}

function goToNextPage() {
  const maxPage = Math.ceil(filteredData.length / recordsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    populateAuditLogTable();
  }
}

function goToLastPage() {
  currentPage = Math.ceil(filteredData.length / recordsPerPage);
  populateAuditLogTable();
}

// Basic Search Implementation
function performBasicSearch() {
// Get all filter values
const userFilter = document.getElementById('userFilter').value.toLowerCase();
const screenNameFilter = document.getElementById('screenNameFilter').value.toLowerCase();
const activityFilter = document.getElementById('activityFilter').value.toLowerCase();
const deviceFilter = document.getElementById('deviceFilter').value.toLowerCase();
const performedAtFilter = document.getElementById('performedAtFilter').value;
const locationFilter = document.getElementById('locationFilter').value.toLowerCase();

// Filter the data
filteredData = auditLogData.filter(log => {
// Date comparison
if (performedAtFilter) {
const logDate = new Date(log.Performedat.split(' ')[0].split('-').reverse().join('-'));
const filterDate = new Date(performedAtFilter);
if (logDate.toDateString() !== filterDate.toDateString()) {
  return false;
}
}

// Text field comparisons (case insensitive)
if (userFilter && !log.User.toLowerCase().includes(userFilter)) {
return false;
}
if (screenNameFilter && !log.ScreenName.toLowerCase().includes(screenNameFilter)) {
return false;
}
if (activityFilter && !log.Activity.toLowerCase().includes(activityFilter)) {
return false;
}
if (deviceFilter && !log.Device.toLowerCase().includes(deviceFilter)) {
return false;
}
if (locationFilter && !log.Location.toLowerCase().includes(locationFilter)) {
return false;
}

return true;
});

currentPage = 1;
populateAuditLogTable();
}

// Advanced Search Implementation
// Advanced Search Implementation
function performAdvancedSearch() {
const matchType = document.querySelector('input[name="matchType"]:checked').value;
const conditions = [];

// Collect all conditions from the form with their prefixes
document.querySelectorAll(".condition-row").forEach((row, index) => {
  const prefix = index === 0 ? 'AND' : row.querySelector(".condition-prefix").value;
  const condition = {
      prefix: prefix,
      field: row.querySelector(".field-select").value,
      operator: row.querySelector(".operator-select").value,
      value: row.querySelector(".value-input").value
  };
  if (condition.value) conditions.push(condition);
});

if (conditions.length === 0) {
  // If no conditions, show all data
  filteredData = [...auditLogData];
} else {
  // Filter data based on conditions
  filteredData = auditLogData.filter(log => {
      let finalResult = true;
      let previousResult = null;

      conditions.forEach((condition, index) => {
          const currentResult = evaluateCondition(log, condition);
          
          if (index === 0) {
              // First condition always applies
              finalResult = currentResult;
          } else {
              // Apply AND/OR logic with previous result
              const prefix = condition.prefix;
              if (prefix === 'AND') {
                  finalResult = finalResult && currentResult;
              } else { // OR
                  finalResult = finalResult || currentResult;
              }
          }
          
          previousResult = currentResult;
      });
      
      return finalResult;
  });
}

currentPage = 1;
populateAuditLogTable();
}

function evaluateCondition(log, condition) {
const logValue = getAdvancedSearchLogValue(log, condition.field).toString().toLowerCase();
const conditionValue = condition.value.toString().toLowerCase();

switch(condition.operator) {
  case 'is': 
      return logValue === conditionValue;
  case 'contains':
      return logValue.includes(conditionValue);
  case 'starts_with':
      return logValue.startsWith(conditionValue);
  case 'ends_with':
      return logValue.endsWith(conditionValue);
  case 'before':
      return compareDates(log, condition.field, condition.value, 'before');
  case 'after':
      return compareDates(log, condition.field, condition.value, 'after');
  default:
      return false;
}
}

// Helper function to get log value based on field
function getAdvancedSearchLogValue(log, field) {
switch(field) {
  case 'User': return log.User || '';
  case 'Screen Name': return log.ScreenName || '';
  case 'Activity': return log.Activity || '';
  case 'Device': return log.Device || '';
  case 'Performed At': return log.Performedat || '';
  case 'Location': return log.Location || '';
  default: return '';
}
}

// Helper function to compare dates
function compareDates(log, field, value, comparison) {
try {
  const logDateStr = getAdvancedSearchLogValue(log, field);
  const filterDate = new Date(value);
  
  // Parse the log date string (format: "02-Apr-2025 03:20 PM")
  const dateParts = logDateStr.split(' ');
  if (dateParts.length < 3) return false;
  
  const dateStr = dateParts[0]; // "02-Apr-2025"
  const timeStr = dateParts[1] + ' ' + dateParts[2]; // "03:20 PM"
  
  // Parse day, month, year
  const [day, month, year] = dateStr.split('-');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = monthNames.indexOf(month);
  
  // Parse time
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hourInt = parseInt(hours);
  if (period === 'PM' && hourInt < 12) hourInt += 12;
  if (period === 'AM' && hourInt === 12) hourInt = 0;
  
  // Create Date object
  const logDate = new Date(year, monthIndex, day, hourInt, minutes);
  
  // Compare dates
  if (comparison === 'before') {
      return logDate < filterDate;
  } else if (comparison === 'after') {
      return logDate > filterDate;
  }
  return false;
} catch (e) {
  console.error("Error comparing dates:", e);
  return false;
}
}
function getLogValue(log, field) {
switch(field) {
case 'User': return log.User;
case 'Screen Name': return log.ScreenName;
case 'Activity': return log.Activity;
case 'Device': return log.Device;
case 'Performed At': return log.Performedat;
case 'Location': return log.Location;
default: return '';
}
}

function getLogValue(log, field) {
  switch(field) {
    case 'username':
      return log.user;
    case 'action':
      return log.action;
    case 'module':
      return log.module;
    case 'date':
      return log.dateTime;
    case 'ip':
      return log.ipAddress;
    case 'description':
      return log.description;
    default:
      return '';
  }
}

// Reset filters
function resetFilters() {
// Clear all filter inputs
document.getElementById('userFilter').value = '';
document.getElementById('screenNameFilter').value = '';
document.getElementById('activityFilter').value = '';
document.getElementById('deviceFilter').value = '';
document.getElementById('performedAtFilter').value = '';
document.getElementById('locationFilter').value = '';

// Reset to full dataset
filteredData = [...auditLogData];
currentPage = 1;
populateAuditLogTable();

// Hide search section if needed
document.getElementById("searchSection").style.display = "none";
document.getElementById("searchBtn").style.display = "block";
}
// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
  populateAuditLogTable();
});





    // Simplified version keeping only core logic
    document.addEventListener('click', function(e) {
        // Condition row management
        if (e.target.classList.contains('more-btn')) {
            addConditionRow();
        }
        if (e.target.classList.contains('fewer-btn')) {
            removeConditionRow(e.target);
        }
    });

    function addConditionRow() {
        const newRow = document.createElement('div');
        newRow.className = 'condition-row';
        newRow.innerHTML = `
            <select class="condition-prefix">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
            <select class="field-select">${document.querySelector('.field-select').innerHTML}</select>
            <select class="operator-select">${document.querySelector('.operator-select').innerHTML}</select>
            <input type="text" class="value-input" placeholder="Enter value">
            <button class="fewer-btn">↑ Fewer</button>
        `;
        document.getElementById('conditionsContainer').appendChild(newRow);
    }

    function removeConditionRow(button) {
        button.closest('.condition-row').remove();
    }

    // Search functionality
    document.querySelector('.search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
        const results = [];
        
        document.querySelectorAll('.condition-row').forEach(row => {
            const field = row.querySelector('.field-select').value;
            const operator = row.querySelector('.operator-select').value;
            const value = row.querySelector('.value-input').value;
            
            if (field.toLowerCase().includes(searchTerm) || 
                operator.toLowerCase().includes(searchTerm) || 
                value.toLowerCase().includes(searchTerm)) {
                results.push({ field, operator, value });
            }
        });

        updateResultsDisplay(results);
    });

    function updateResultsDisplay(results) {
        const tbody = document.getElementById('resultsBody');
        tbody.innerHTML = '';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.field}</td>
                <td>${result.operator}</td>
                <td>${result.value}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Initial setup
    document.querySelector('.condition-prefix').style.visibility = 'hidden';
