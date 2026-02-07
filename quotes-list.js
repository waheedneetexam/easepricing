// ===================================
// QUOTES LIST PAGE LOGIC
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    renderQuotesTable();
    initializeEventListeners();
});

// ===================================
// RENDER QUOTES TABLE
// ===================================
function renderQuotesTable() {
    const tbody = document.getElementById('quotesTableBody');
    tbody.innerHTML = '';

    QUOTES_LIST.forEach((quote, index) => {
        const row = document.createElement('tr');
        row.onclick = () => openQuote(quote.id);

        const statusClass = quote.status === 'Draft' ? 'status-draft' :
            quote.status === 'Submitted' ? 'status-submitted' :
                'status-approved';

        row.innerHTML = `
      <td class="col-checkbox">
        <input type="checkbox" onclick="event.stopPropagation()">
      </td>
      <td class="col-name">
        <a href="#" class="quote-name" onclick="event.preventDefault(); openQuote('${quote.id}')">${quote.id}</a>
      </td>
      <td class="col-label">${quote.label}</td>
      <td class="col-external">${quote.externalRef}</td>
      <td class="col-date">${quote.effectiveDate}</td>
      <td class="col-workflow">${quote.workflow}</td>
      <td class="col-date">${quote.lastUpdate}</td>
      <td class="col-date">${quote.created}</td>
      <td class="col-date">${quote.expiry}</td>
      <td class="col-status">
        <span class="status-badge ${statusClass}">${quote.status}</span>
      </td>
    `;

        tbody.appendChild(row);
    });

    updateRowCount();
}

// ===================================
// EVENT LISTENERS
// ===================================
function initializeEventListeners() {
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            const checkboxes = document.querySelectorAll('.quotes-grid tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    // Page size selector
    const pageSize = document.querySelector('.page-size');
    if (pageSize) {
        pageSize.addEventListener('change', function () {
            console.log('Page size changed to:', this.value);
            // In a real app, this would reload the data with new page size
        });
    }
}

// ===================================
// ACTIONS
// ===================================
function openQuote(quoteId) {
    console.log('Opening quote:', quoteId);
    // Navigate to quote detail page
    window.location.href = `index.html?id=${quoteId}`;
}

function createNewQuote() {
    console.log('Creating new quote');
    window.location.href = 'index.html';
}

function editFilter() {
    alert('Edit Filter functionality would open a filter configuration dialog.');
}

function clearFilter() {
    alert('Clear Filter - This would remove all active filters.');
}

function updateRowCount() {
    const rowCount = document.querySelector('.row-count');
    if (rowCount) {
        rowCount.textContent = `${QUOTES_LIST.length} rows`;
    }
}

// ===================================
// SEARCH AND FILTER
// ===================================
function filterQuotes(searchTerm, column) {
    // This would filter the quotes based on search criteria
    console.log('Filtering quotes:', searchTerm, 'in column:', column);
    // Implementation would go here
}

function sortQuotes(column, direction) {
    // This would sort the quotes by the specified column
    console.log('Sorting quotes by:', column, direction);
    // Implementation would go here
}
