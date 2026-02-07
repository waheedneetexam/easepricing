// Target Schema for Sales History
const TARGET_FIELDS = [
    { value: '', label: 'Skip this column' },
    { value: 'date', label: 'Date / Period' },
    { value: 'product_id', label: 'Product ID' },
    { value: 'product_name', label: 'Product Name' },
    { value: 'customer_id', label: 'Customer ID' },
    { value: 'customer_name', label: 'Customer Name' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'unit_price', label: 'Unit Price' },
    { value: 'total_amount', label: 'Total Amount' },
    { value: 'region', label: 'Region / Territory' },
    { value: 'currency', label: 'Currency' },
    { value: 'discount', label: 'Discount %' },
    { value: 'category', label: 'Category' }
];

// Global state
let csvData = {
    headers: [],
    rows: [],
    fileName: '',
    mapping: {}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeUpload();
    loadSavedConfiguration();
});

// Upload initialization
function initializeUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // Click to browse
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File selection
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and drop events
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    });
}

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        showNotification('Please select a CSV file', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification('File size exceeds 10MB limit', 'error');
        return;
    }

    csvData.fileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        parseCSV(e.target.result);
    };
    reader.readAsText(file);
}

// CSV Parser with auto-delimiter detection
function parseCSV(content) {
    // Detect delimiter
    const delimiters = [',', ';', '\t', '|'];
    let bestDelimiter = ',';
    let maxColumns = 0;

    delimiters.forEach(delimiter => {
        const firstLine = content.split('\n')[0];
        const columns = firstLine.split(delimiter).length;
        if (columns > maxColumns) {
            maxColumns = columns;
            bestDelimiter = delimiter;
        }
    });

    // Parse CSV
    const lines = content.trim().split('\n');
    const headers = parseCSVLine(lines[0], bestDelimiter);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const row = parseCSVLine(lines[i], bestDelimiter);
            rows.push(row);
        }
    }

    csvData.headers = headers;
    csvData.rows = rows;

    // Initialize mapping with smart suggestions
    csvData.mapping = generateSmartMapping(headers);

    // Update UI
    displayMappingInterface();
    displayPreview();
    updateFileInfo();

    // Show mapping section, hide upload section
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('mappingSection').classList.remove('hidden');
}

// Parse a single CSV line (handles quoted values)
function parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Smart mapping suggestions using fuzzy matching
function generateSmartMapping(headers) {
    const mapping = {};

    headers.forEach((header, index) => {
        const normalized = header.toLowerCase().replace(/[_\s-]/g, '');

        // Try to find best match
        let bestMatch = '';
        let bestScore = 0;

        TARGET_FIELDS.forEach(field => {
            if (field.value === '') return;

            const fieldNormalized = field.value.toLowerCase().replace(/[_\s-]/g, '');
            const score = similarityScore(normalized, fieldNormalized);

            // Also check the label
            const labelNormalized = field.label.toLowerCase().replace(/[_\s-]/g, '');
            const labelScore = similarityScore(normalized, labelNormalized);

            const maxScore = Math.max(score, labelScore);

            if (maxScore > bestScore && maxScore > 0.5) {
                bestScore = maxScore;
                bestMatch = field.value;
            }
        });

        mapping[index] = {
            csvColumn: header,
            targetField: bestMatch,
            suggested: bestMatch !== '',
            sampleValue: csvData.rows[0] ? csvData.rows[0][index] : ''
        };
    });

    return mapping;
}

// Calculate similarity score between two strings
function similarityScore(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;

    // Levenshtein-like simple matching
    let matches = 0;
    const minLen = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLen; i++) {
        if (str1[i] === str2[i]) matches++;
    }

    return matches / Math.max(str1.length, str2.length);
}

// Display mapping interface
function displayMappingInterface() {
    const mappingGrid = document.getElementById('mappingGrid');
    mappingGrid.innerHTML = '';

    let mappedCount = 0;
    let suggestedCount = 0;
    let unmappedCount = 0;

    Object.keys(csvData.mapping).forEach(index => {
        const map = csvData.mapping[index];

        if (map.targetField !== '') {
            if (map.suggested) suggestedCount++;
            else mappedCount++;
        } else {
            unmappedCount++;
        }

        const card = document.createElement('div');
        card.className = 'mapping-card';
        if (map.targetField !== '') {
            card.classList.add(map.suggested ? 'suggested' : 'mapped');
        }

        card.innerHTML = `
            <div class="mapping-card-header">
                ${map.suggested && map.targetField !== '' ? '<span class="mapping-badge suggested">Suggested</span>' : ''}
                <span class="csv-column">${map.csvColumn}</span>
            </div>
            <div class="mapping-label">Map to:</div>
            <select class="mapping-select" data-index="${index}" onchange="updateMapping(${index}, this.value)">
                ${TARGET_FIELDS.map(field =>
            `<option value="${field.value}" ${field.value === map.targetField ? 'selected' : ''}>
                        ${field.label}
                    </option>`
        ).join('')}
            </select>
            <div class="sample-value">Sample: ${map.sampleValue || 'N/A'}</div>
        `;

        mappingGrid.appendChild(card);
    });

    // Update status counts
    document.getElementById('mappedCount').textContent = mappedCount;
    document.getElementById('suggestedCount').textContent = suggestedCount;
    document.getElementById('unmappedCount').textContent = unmappedCount;
}

// Update mapping when user changes selection
function updateMapping(index, targetField) {
    csvData.mapping[index].targetField = targetField;
    csvData.mapping[index].suggested = false; // No longer a suggestion once manually set

    displayMappingInterface();
    displayPreview();
}

// Display data preview
function displayPreview() {
    const tableHead = document.getElementById('previewTableHead');
    const tableBody = document.getElementById('previewTableBody');

    // Create headers
    const headerRow = document.createElement('tr');
    Object.values(csvData.mapping).forEach(map => {
        const th = document.createElement('th');

        // Show target field if mapped, otherwise CSV column
        const displayName = map.targetField !== ''
            ? TARGET_FIELDS.find(f => f.value === map.targetField)?.label || map.csvColumn
            : map.csvColumn;

        th.innerHTML = `
            ${displayName}
            ${map.targetField !== '' ? '<br><span style="font-size: 0.75rem; color: var(--color-text-tertiary);">(' + map.csvColumn + ')</span>' : ''}
        `;
        headerRow.appendChild(th);
    });
    tableHead.innerHTML = '';
    tableHead.appendChild(headerRow);

    // Create rows (first 10)
    tableBody.innerHTML = '';
    const rowsToShow = csvData.rows.slice(0, 10);

    rowsToShow.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Update file info
function updateFileInfo() {
    document.getElementById('fileName').textContent = csvData.fileName;
    document.getElementById('fileStats').textContent =
        `${csvData.rows.length} rows, ${csvData.headers.length} columns`;
}

// Upload new file
function uploadNew() {
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('mappingSection').classList.add('hidden');
    document.getElementById('fileInput').value = '';

    csvData = {
        headers: [],
        rows: [],
        fileName: '',
        mapping: {}
    };
}

// Reset mapping to initial smart suggestions
function resetMapping() {
    csvData.mapping = generateSmartMapping(csvData.headers);
    displayMappingInterface();
    displayPreview();
    showNotification('Mapping reset to smart suggestions');
}

// Save configuration to localStorage
function saveConfiguration() {
    const config = {
        fileName: csvData.fileName,
        mapping: csvData.mapping,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('csv_ingestor_config', JSON.stringify(config));
    showNotification('Configuration saved successfully!');
}

// Load saved configuration
function loadSavedConfiguration() {
    const saved = localStorage.getItem('csv_ingestor_config');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            console.log('Loaded saved configuration:', config);
        } catch (e) {
            console.error('Failed to load configuration:', e);
        }
    }
}

// Export data
function exportData(format) {
    if (csvData.rows.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    if (format === 'json') {
        exportAsJSON();
    } else if (format === 'csv') {
        exportAsCSV();
    }
}

// Export as JSON
function exportAsJSON() {
    const exportData = csvData.rows.map(row => {
        const obj = {};
        Object.keys(csvData.mapping).forEach(index => {
            const map = csvData.mapping[index];
            if (map.targetField !== '') {
                obj[map.targetField] = row[index];
            }
        });
        return obj;
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, csvData.fileName.replace('.csv', '') + '_mapped.json');
    showNotification('Exported as JSON');
}

// Export as CSV
function exportAsCSV() {
    // Create header row with mapped field names
    const headers = [];
    Object.values(csvData.mapping).forEach(map => {
        if (map.targetField !== '') {
            headers.push(map.targetField);
        }
    });

    // Create data rows
    const rows = csvData.rows.map(row => {
        const mappedRow = [];
        Object.keys(csvData.mapping).forEach(index => {
            const map = csvData.mapping[index];
            if (map.targetField !== '') {
                mappedRow.push(escapeCSVValue(row[index]));
            }
        });
        return mappedRow.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlob(blob, csvData.fileName.replace('.csv', '') + '_mapped.csv');
    showNotification('Exported as CSV');
}

// Escape CSV values
function escapeCSVValue(value) {
    if (value === null || value === undefined) return '';
    value = String(value);
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}

// Download blob as file
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAll() {
    if (confirm('Are you sure you want to clear all data and start over?')) {
        localStorage.removeItem('csv_ingestor_config');
        uploadNew();
        showNotification('All data cleared');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    notificationText.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}
