// ===================================
// APPLICATION STATE
// ===================================
let quoteData = {
    id: 'P-1148',
    status: 'Draft - All Changes Saved',
    effectiveDate: '2024-06-06',
    expiryDate: '2024-07-06',
    customer: 'CH-0003',
    currency: 'USD',
    discountType: 'Flat Discount %',
    discountPercent: 5,
    externalReference: 'REF-2024-Q2-089',
    items: []
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    populateDropdowns();
    loadSampleData();
    renderItems();
    drawWaterfallChart();
});

// ===================================
// TAB NAVIGATION
// ===================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to selected tab
    const tabMap = {
        'header': 'headerTab',
        'items': 'itemsTab',
        'attachments': 'attachmentsTab',
        'workflow': 'workflowTab',
        'messages': 'messagesTab'
    };

    const targetTab = document.getElementById(tabMap[tabName]);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// ===================================
// SECTION COLLAPSE/EXPAND
// ===================================
function toggleSection(headerElement) {
    const content = headerElement.nextElementSibling;
    const icon = headerElement.querySelector('.collapse-icon');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.classList.remove('collapsed');
    } else {
        content.classList.add('collapsed');
        icon.classList.add('collapsed');
    }
}

// ===================================
// POPULATE DROPDOWNS
// ===================================
function populateDropdowns() {
    // Populate Customers
    const customerSelect = document.getElementById('customer');
    CUSTOMERS.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.id} - ${customer.name}`;
        customerSelect.appendChild(option);
    });

    // Populate Currencies
    const currencySelect = document.getElementById('currency');
    CURRENCIES.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
    });

    // Populate Discount Types
    const discountTypeSelect = document.getElementById('discountType');
    DISCOUNT_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        discountTypeSelect.appendChild(option);
    });
}

// ===================================
// LOAD SAMPLE DATA
// ===================================
function loadSampleData() {
    // Load sample quote data
    document.getElementById('effectiveDate').value = SAMPLE_QUOTE.effectiveDate;
    document.getElementById('expiryDate').value = SAMPLE_QUOTE.expiryDate;
    document.getElementById('customer').value = SAMPLE_QUOTE.customer;
    document.getElementById('currency').value = SAMPLE_QUOTE.currency;
    document.getElementById('discountType').value = SAMPLE_QUOTE.discountType;
    document.getElementById('flatDiscount').value = SAMPLE_QUOTE.discountPercent;
    document.getElementById('externalReference').value = SAMPLE_QUOTE.externalReference;

    // Load sample items
    SAMPLE_QUOTE.items.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        if (product) {
            addItemToQuote(product, item);
        }
    });
}

// ===================================
// PRODUCT SEARCH
// ===================================
function searchProducts() {
    const searchInput = document.getElementById('productSearch');
    const searchResults = document.getElementById('searchResults');
    const query = searchInput.value.toLowerCase().trim();

    if (query.length === 0) {
        searchResults.classList.remove('active');
        return;
    }

    const filteredProducts = PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<div style="padding: 16px; color: var(--color-text-tertiary);">No products found</div>';
        searchResults.classList.add('active');
        return;
    }

    searchResults.innerHTML = '';
    filteredProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
      <div class="result-info">
        <div class="result-name">${product.name}</div>
        <div class="result-code">${product.code}</div>
      </div>
      <div class="result-code">${product.id}</div>
    `;
        item.onclick = () => selectProduct(product);
        searchResults.appendChild(item);
    });

    searchResults.classList.add('active');
}

function showSearchResults() {
    const searchInput = document.getElementById('productSearch');
    if (searchInput.value.length > 0) {
        searchProducts();
    }
}

function selectProduct(product) {
    addItemToQuote(product);
    document.getElementById('productSearch').value = '';
    document.getElementById('searchResults').classList.remove('active');
}

// Click outside to close search results
document.addEventListener('click', function (event) {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('searchResults');

    if (searchContainer && !searchContainer.contains(event.target)) {
        searchResults.classList.remove('active');
    }
});

// ===================================
// ITEM MANAGEMENT
// ===================================
function addItemToQuote(product, itemData = null) {
    const item = {
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        quantity: itemData?.quantity || 1,
        unitOfMeasure: itemData?.unitOfMeasure || 'LB',
        price: itemData?.price || product.price,
        discount: itemData?.discount || parseFloat(document.getElementById('flatDiscount').value) || 0,
        incoterm: itemData?.incoterm || 'FOB - Free on Board'
    };

    quoteData.items.push(item);
    renderItems();
    drawWaterfallChart();
}

function removeItem(index) {
    if (confirm('Are you sure you want to remove this item?')) {
        quoteData.items.splice(index, 1);
        renderItems();
        drawWaterfallChart();
    }
}

function updateItemQuantity(index, value) {
    quoteData.items[index].quantity = parseInt(value) || 0;
    renderItems();
}

function updateItemPrice(index, value) {
    quoteData.items[index].price = parseFloat(value) || 0;
    renderItems();
}

function updateItemDiscount(index, value) {
    quoteData.items[index].discount = parseFloat(value) || 0;
    renderItems();
}

function updateItemUOM(index, value) {
    quoteData.items[index].unitOfMeasure = value;
}

function updateItemIncoterm(index, value) {
    quoteData.items[index].incoterm = value;
}

// ===================================
// RENDER ITEMS TABLE
// ===================================
function renderItems() {
    const tbody = document.getElementById('itemsTableBody');
    const itemsCount = document.getElementById('itemsCount');
    const itemCount = document.getElementById('itemCount');

    if (quoteData.items.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 40px; color: var(--color-text-tertiary);">
          No items added. Use the search above to add products.
        </td>
      </tr>
    `;
        itemsCount.textContent = '0 rows';
        itemCount.textContent = '0';
        return;
    }

    tbody.innerHTML = '';
    quoteData.items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = (e) => {
            // Don't open panel if clicking on input/select/button
            if (!['INPUT', 'SELECT', 'BUTTON', 'SVG', 'PATH'].includes(e.target.tagName)) {
                openDetailPanel(index);
            }
        };

        // Get product initials for image placeholder
        const initials = item.productName.split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        row.innerHTML = `
      <td>
        <input type="checkbox">
      </td>
      <td>
        <div class="product-cell">
          <div class="product-image">${initials}</div>
          <div class="product-name">${item.productName}</div>
        </div>
      </td>
      <td>${item.productCode}</td>
      <td>
        <input type="number" 
               class="table-input" 
               value="${item.quantity}" 
               min="1"
               onchange="updateItemQuantity(${index}, this.value)">
      </td>
      <td>
        <select class="table-select" onchange="updateItemUOM(${index}, this.value)">
          ${UNITS_OF_MEASURE.map(uom =>
            `<option value="${uom}" ${item.unitOfMeasure === uom ? 'selected' : ''}>${uom}</option>`
        ).join('')}
        </select>
      </td>
      <td>
        <input type="number" 
               class="table-input" 
               value="${item.price.toFixed(2)}" 
               min="0"
               step="0.01"
               onchange="updateItemPrice(${index}, this.value)">
      </td>
      <td>
        <input type="number" 
               class="table-input" 
               value="${item.discount}" 
               min="0"
               max="100"
               step="0.1"
               onchange="updateItemDiscount(${index}, this.value)">
      </td>
      <td>
        <select class="table-select" style="width: 180px;" onchange="updateItemIncoterm(${index}, this.value)">
          ${INCOTERMS.map(term =>
            `<option value="${term}" ${item.incoterm === term ? 'selected' : ''}>${term}</option>`
        ).join('')}
        </select>
      </td>
      <td>
        <button class="remove-btn" onclick="removeItem(${index})" title="Remove item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    `;

        tbody.appendChild(row);
    });

    itemsCount.textContent = `${quoteData.items.length} rows`;
    itemCount.textContent = quoteData.items.length;
}

// ===================================
// WATERFALL CHART
// ===================================
function drawWaterfallChart() {
    const canvas = document.getElementById('waterfallCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = WATERFALL_STAGES;
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / (data.length * 1.5);
    const maxValue = 15;
    const minValue = -10;
    const valueRange = maxValue - minValue;

    // Helper function to get Y position
    function getY(value) {
        return padding + chartHeight - ((value - minValue) / valueRange * chartHeight);
    }

    // Draw zero line
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const zeroY = getY(0);
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(canvas.width - padding, zeroY);
    ctx.stroke();

    // Draw bars
    let runningTotal = 0;
    data.forEach((stage, index) => {
        const x = padding + (index * chartWidth / data.length);
        const barHeight = (Math.abs(stage.value) / valueRange) * chartHeight;

        // Determine color
        let color;
        if (stage.type === 'positive') {
            color = '#1976d2';
        } else if (stage.type === 'negative') {
            color = '#d32f2f';
        } else {
            color = '#757575';
        }

        // Draw bar
        ctx.fillStyle = color;
        const barY = stage.value >= 0 ? getY(stage.value) : getY(0);
        ctx.fillRect(x + 10, barY, barWidth - 20, barHeight);

        // Draw value label
        ctx.fillStyle = '#212121';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        const labelY = stage.value >= 0 ? barY - 8 : barY + barHeight + 16;
        ctx.fillText(stage.value.toFixed(1), x + barWidth / 2, labelY);

        // Draw stage label
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - padding + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#757575';
        ctx.font = '11px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(stage.label, 0, 0);
        ctx.restore();

        // Draw connecting line to next bar (if not last)
        if (index < data.length - 1) {
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const currentTop = stage.value >= 0 ? getY(stage.value) : getY(0);
            const nextX = padding + ((index + 1) * chartWidth / data.length);
            ctx.moveTo(x + barWidth - 10, currentTop);
            ctx.lineTo(nextX + 10, currentTop);
            ctx.stroke();

            // Draw circle at connection point
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.arc(x + barWidth - 10, currentTop, 3, 0, 2 * Math.PI);
            ctx.fill();
        }

        runningTotal += stage.value;
    });
}

// ===================================
// ACTION HANDLERS
// ===================================
function saveQuote() {
    // Gather form data
    quoteData.effectiveDate = document.getElementById('effectiveDate').value;
    quoteData.expiryDate = document.getElementById('expiryDate').value;
    quoteData.customer = document.getElementById('customer').value;
    quoteData.currency = document.getElementById('currency').value;
    quoteData.discountType = document.getElementById('discountType').value;
    quoteData.discountPercent = parseFloat(document.getElementById('flatDiscount').value);
    quoteData.externalReference = document.getElementById('externalReference').value;

    console.log('Quote saved:', quoteData);
    alert('Quote saved successfully!');

    // Update status
    document.getElementById('quoteStatus').textContent = 'Draft - All Changes Saved';
}

function recalculate() {
    // Recalculate logic would go here
    console.log('Recalculating quote...');
    drawWaterfallChart();
    alert('Quote recalculated!');
}

function deleteQuote() {
    if (confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
        console.log('Quote deleted');
        alert('Quote deleted successfully!');
        // In a real app, this would navigate away or clear the form
    }
}

function showAddItemsModal() {
    document.getElementById('productSearch').focus();
    alert('Use the search box below to find and add products to your quote.');
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function calculateSubtotal() {
    return quoteData.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function calculateDiscount() {
    const subtotal = calculateSubtotal();
    return quoteData.items.reduce((total, item) => {
        const itemTotal = item.price * item.quantity;
        return total + (itemTotal * item.discount / 100);
    }, 0);
}

function calculateTotal() {
    return calculateSubtotal() - calculateDiscount();
}

// ===================================
// DETAIL & SETTINGS SIDEBAR
// ===================================
let selectedItemIndex = null;

function openDetailPanel(itemIndex) {
    selectedItemIndex = itemIndex;
    const sidebar = document.getElementById('detailSidebar');
    sidebar.classList.add('open');

    // Populate detail panel with item data
    if (itemIndex !== null && quoteData.items[itemIndex]) {
        const item = quoteData.items[itemIndex];
        const product = PRODUCTS.find(p => p.id === item.productId);

        // Details Tab
        document.getElementById('detailProductId').textContent = item.productCode;
        document.getElementById('detailProductName').textContent = item.productName;
        document.getElementById('detailDescription').textContent = product?.description || '-';

        // Input Parameters Tab
        document.getElementById('detailQuantity').textContent = item.quantity;
        document.getElementById('detailUOM').textContent = item.unitOfMeasure;
        document.getElementById('detailBasePrice').textContent = `${item.price.toFixed(2)} ${quoteData.currency}`;
        document.getElementById('detailDiscount').textContent = `${item.discount}%`;
        document.getElementById('detailIncoterm').textContent = item.incoterm;

        // Calculations Tab
        const quantity = item.quantity;
        const cost = item.price * 0.88; // Assume 88% cost
        const listPrice = item.price;
        const discount = listPrice * (item.discount / 100);
        const suggestedPrice = listPrice - discount;
        const warehousingAdj = listPrice * 0.02;
        const packagingAdj = listPrice * 0.03;

        document.getElementById('calcCurrency').textContent = quoteData.currency;
        document.getElementById('calcQuantity').textContent = quantity;
        document.getElementById('calcCost').textContent = `${(cost * quantity).toFixed(2)} ${quoteData.currency}`;
        document.getElementById('calcListPrice').textContent = `${listPrice.toFixed(2)} ${quoteData.currency}`;
        document.getElementById('calcDiscountPercent').textContent = `${item.discount.toFixed(2)}%`;
        document.getElementById('calcSuggestedPrice').textContent = `${suggestedPrice.toFixed(2)} ${quoteData.currency}`;
        document.getElementById('calcWarehousing').textContent = `${warehousingAdj.toFixed(2)} ${quoteData.currency}`;
        document.getElementById('calcPackaging').textContent = `${packagingAdj.toFixed(2)} ${quoteData.currency}`;
    }
}

function closeDetailPanel() {
    const sidebar = document.getElementById('detailSidebar');
    sidebar.classList.remove('open');
    selectedItemIndex = null;
}

function switchDetailTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.detail-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    const tabBtn = document.querySelector(`[data-detail-tab="${tabName}"]`);
    if (tabBtn) {
        tabBtn.classList.add('active');
    }

    // Show corresponding content
    const contentMap = {
        'details': 'detailsTabContent',
        'input-params': 'inputParamsTabContent',
        'calculations': 'calculationsTabContent'
    };

    const targetContent = document.getElementById(contentMap[tabName]);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}
