// ===================================
// PRICE WATERFALL ENGINE
// ===================================

// State
let priceData = {
    listPrice: 100,
    volumeDiscount: 10,
    customerRebate: 5,
    promoDiscount: 3,
    earlyPayment: 2,
    freight: 8,
    handling: 2,
    paymentTerms: 1.5,
    returns: 0.5,
    unitCost: 50, // Unit Cost (COGS)
    currentCurrency: 'USD' // Default currency
};

const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    GBP: { symbol: '£', name: 'UK Pound', flag: '🇬🇧' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
    JPY: { symbol: '¥', name: 'Japan Yen', flag: '🇯🇵' },
    LKR: { symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰' }
};

let customComponents = []; // User-defined components
let waterfallComponents = [];
let chartCanvas, chartCtx;

// ===================================
// CONFIGURATION TEMPLATES
// ===================================
const TEMPLATES = {
    default: {
        name: "Default Configuration",
        priceData: {
            listPrice: 100,
            volumeDiscount: 10,
            customerRebate: 5,
            promoDiscount: 3,
            earlyPayment: 2,
            freight: 8,
            handling: 2,
            paymentTerms: 1.5,
            returns: 0.5,
            unitCost: 50
        },
        customComponents: []
    },
    amazon: {
        name: "Amazon Marketplace Seller",
        priceData: {
            listPrice: 100,
            volumeDiscount: 8,
            customerRebate: 0,
            promoDiscount: 5,
            earlyPayment: 0,
            freight: 5,
            handling: 0,
            paymentTerms: 0,
            returns: 1,
            unitCost: 40
        },
        customComponents: [
            {
                name: 'Amazon Referral Fee',
                type: 'cost',
                calcMethod: 'fixed',
                value: 15,
                position: 'after-pocket',
                emoji: '🛒'
            },
            {
                name: 'FBA Fulfillment',
                type: 'cost',
                calcMethod: 'fixed',
                value: 5,
                position: 'after-pocket',
                emoji: '📦'
            },
            {
                name: 'Amazon Advertising',
                type: 'cost',
                calcMethod: 'fixed',
                value: 3,
                position: 'after-pocket',
                emoji: '📢'
            },
            {
                name: 'Returns Processing',
                type: 'cost',
                calcMethod: 'fixed',
                value: 2,
                position: 'after-pocket',
                emoji: '↩️'
            }
        ]
    },
    instagram_saree: {
        name: "Instagram Saree Business",
        priceData: {
            listPrice: 80,
            volumeDiscount: 5,
            customerRebate: 10,
            promoDiscount: 3,
            earlyPayment: 0,
            freight: 4,
            handling: 1,
            paymentTerms: 0,
            returns: 0.5,
            unitCost: 30
        },
        customComponents: [
            {
                name: 'Instagram Ad Spend',
                type: 'cost',
                calcMethod: 'fixed',
                value: 5,
                position: 'after-pocket',
                emoji: '📱'
            },
            {
                name: 'Influencer Commission',
                type: 'cost',
                calcMethod: 'percent',
                value: 8,
                position: 'after-discounts',
                emoji: '⭐'
            },
            {
                name: 'Premium Packaging',
                type: 'addition',
                calcMethod: 'fixed',
                value: 2,
                position: 'after-discounts',
                emoji: '🎁'
            },
            {
                name: 'Bulk Order Discount',
                type: 'discount',
                calcMethod: 'percent',
                value: 5,
                position: 'after-discounts',
                emoji: '📦'
            }
        ]
    },
    b2b_electronics: {
        name: "B2B Wholesale Electronics",
        priceData: {
            listPrice: 500,
            volumeDiscount: 15,
            customerRebate: 10,
            promoDiscount: 0,
            earlyPayment: 2,
            freight: 20,
            handling: 5,
            paymentTerms: 1,
            returns: 0.3,
            unitCost: 300
        },
        customComponents: [
            {
                name: 'Extended Warranty',
                type: 'cost',
                calculation: 'flat',
                value: 15,
                position: 'afterCosts',
                emoji: '🛡️'
            },
            {
                name: 'White Label Fee',
                type: 'addition',
                calculation: 'flat',
                value: 25,
                position: 'afterDiscounts',
                emoji: '🏷️'
            },
            {
                name: 'Tech Support',
                type: 'cost',
                calculation: 'flat',
                value: 10,
                position: 'afterCosts',
                emoji: '💻'
            }
        ]
    },
    saas: {
        name: "SaaS Subscription Service",
        priceData: {
            listPrice: 200,
            volumeDiscount: 0,
            customerRebate: 0,
            promoDiscount: 10,
            earlyPayment: 0,
            freight: 0,
            handling: 0,
            paymentTerms: 0,
            returns: 0,
            unitCost: 55
        },
        customComponents: [
            {
                name: 'Annual Commitment Discount',
                type: 'discount',
                calculation: 'percentList',
                value: 20,
                position: 'afterDiscounts',
                emoji: '📅'
            },
            {
                name: 'Cloud Hosting',
                type: 'cost',
                calculation: 'flat',
                value: 30,
                position: 'afterCosts',
                emoji: '☁️'
            },
            {
                name: 'Support Cost',
                type: 'cost',
                calculation: 'flat',
                value: 15,
                position: 'afterCosts',
                emoji: '🎧'
            },
            {
                name: 'Customer Success',
                type: 'cost',
                calculation: 'flat',
                value: 10,
                position: 'afterCosts',
                emoji: '👥'
            }
        ]
    },
    fashion_retail: {
        name: "Fashion Boutique Retail",
        priceData: {
            listPrice: 150,
            volumeDiscount: 0,
            customerRebate: 12,
            promoDiscount: 8,
            earlyPayment: 0,
            freight: 8,
            handling: 3,
            paymentTerms: 0,
            returns: 1,
            unitCost: 60
        },
        customComponents: [
            {
                name: 'Seasonal Clearance',
                type: 'discount',
                calculation: 'percentList',
                value: 15,
                position: 'afterDiscounts',
                emoji: '🏷️'
            },
            {
                name: 'Alteration Service',
                type: 'addition',
                calculation: 'flat',
                value: 15,
                position: 'afterDiscounts',
                emoji: '✂️'
            },
            {
                name: 'Gift Packaging',
                type: 'addition',
                calculation: 'flat',
                value: 5,
                position: 'afterDiscounts',
                emoji: '🎁'
            }
        ]
    }
};



// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    chartCanvas = document.getElementById('waterfallCanvas');
    chartCtx = chartCanvas.getContext('2d');

    loadCustomComponents();
    loadDefaultValues();
    renderCustomComponentsList();
    recalculate();
    setupChartInteractivity();
});

// Load default values into inputs
function loadDefaultValues() {
    document.getElementById('inputListPrice').value = priceData.listPrice;
    document.getElementById('inputVolumeDiscount').value = priceData.volumeDiscount;
    document.getElementById('inputCustomerRebate').value = priceData.customerRebate;
    document.getElementById('inputPromoDiscount').value = priceData.promoDiscount;
    document.getElementById('inputEarlyPayment').value = priceData.earlyPayment;
    document.getElementById('inputFreight').value = priceData.freight;
    document.getElementById('inputHandling').value = priceData.handling;
    document.getElementById('inputPaymentTerms').value = priceData.paymentTerms;
    document.getElementById('inputReturns').value = priceData.returns;
    document.getElementById('inputUnitCost').value = priceData.unitCost;
}

// ===================================
// CALCULATION ENGINE
// ===================================
function recalculate() {
    // Read values from inputs
    priceData.listPrice = parseFloat(document.getElementById('inputListPrice').value) || 0;
    priceData.volumeDiscount = parseFloat(document.getElementById('inputVolumeDiscount').value) || 0;
    priceData.customerRebate = parseFloat(document.getElementById('inputCustomerRebate').value) || 0;
    priceData.promoDiscount = parseFloat(document.getElementById('inputPromoDiscount').value) || 0;
    priceData.earlyPayment = parseFloat(document.getElementById('inputEarlyPayment').value) || 0;
    priceData.freight = parseFloat(document.getElementById('inputFreight').value) || 0;
    priceData.handling = parseFloat(document.getElementById('inputHandling').value) || 0;
    priceData.paymentTerms = parseFloat(document.getElementById('inputPaymentTerms').value) || 0;
    priceData.returns = parseFloat(document.getElementById('inputReturns').value) || 0;
    priceData.unitCost = parseFloat(document.getElementById('inputUnitCost').value) || 0;

    // Calculate waterfall components
    waterfallComponents = calculateWaterfall();

    // Update UI
    updateMetrics();
    updateBreakdownTable();
    drawWaterfall();
}

function calculateWaterfall() {
    const components = [];
    let cumulative = priceData.listPrice;

    // 1. List Price (starting point)
    components.push({
        name: 'List Price',
        value: priceData.listPrice,
        type: 'total',
        cumulative: cumulative,
        percentOfList: 100
    });

    // 2. Volume Discount
    const volumeDiscountAmt = -1 * (priceData.listPrice * priceData.volumeDiscount / 100);
    cumulative += volumeDiscountAmt;
    components.push({
        name: 'Volume Discount',
        value: volumeDiscountAmt,
        type: 'discount',
        cumulative: cumulative,
        percentOfList: (volumeDiscountAmt / priceData.listPrice) * 100
    });

    // 3. Customer Rebate
    const rebateAmt = -1 * (priceData.listPrice * priceData.customerRebate / 100);
    cumulative += rebateAmt;
    components.push({
        name: 'Customer Rebate',
        value: rebateAmt,
        type: 'rebate',
        cumulative: cumulative,
        percentOfList: (rebateAmt / priceData.listPrice) * 100
    });

    // 4. Promotional Discount
    const promoAmt = -1 * (priceData.listPrice * priceData.promoDiscount / 100);
    cumulative += promoAmt;
    components.push({
        name: 'Promotional Discount',
        value: promoAmt,
        type: 'discount',
        cumulative: cumulative,
        percentOfList: (promoAmt / priceData.listPrice) * 100
    });

    // 5. Early Payment Discount
    const earlyPaymentAmt = -1 * (priceData.listPrice * priceData.earlyPayment / 100);
    cumulative += earlyPaymentAmt;
    components.push({
        name: 'Early Payment Discount',
        value: earlyPaymentAmt,
        type: 'discount',
        cumulative: cumulative,
        percentOfList: (earlyPaymentAmt / priceData.listPrice) * 100
    });

    // Insert custom components at "after-discounts" position
    customComponents.filter(c => c.position === 'after-discounts').forEach(custom => {
        const customValue = calculateCustomValue(custom, cumulative);
        cumulative += customValue;
        components.push({
            name: custom.name,
            value: customValue,
            type: custom.type,
            cumulative: cumulative,
            percentOfList: (customValue / priceData.listPrice) * 100,
            isCustom: true
        });
    });

    // 6. SUBTOTAL: Pocket Price
    components.push({
        name: 'Pocket Price',
        value: cumulative,
        type: 'subtotal',
        cumulative: cumulative,
        percentOfList: (cumulative / priceData.listPrice) * 100
    });

    // 7. Freight Cost
    cumulative -= priceData.freight;
    components.push({
        name: 'Freight Cost',
        value: -priceData.freight,
        type: 'cost',
        cumulative: cumulative,
        percentOfList: (-priceData.freight / priceData.listPrice) * 100
    });

    // 8. Handling Charges
    cumulative -= priceData.handling;
    components.push({
        name: 'Handling Charges',
        value: -priceData.handling,
        type: 'cost',
        cumulative: cumulative,
        percentOfList: (-priceData.handling / priceData.listPrice) * 100
    });

    // Insert custom components at "after-pocket" position
    customComponents.filter(c => c.position === 'after-pocket').forEach(custom => {
        const customValue = calculateCustomValue(custom, cumulative);
        cumulative += customValue;
        components.push({
            name: custom.name,
            value: customValue,
            type: custom.type,
            cumulative: cumulative,
            percentOfList: (customValue / priceData.listPrice) * 100,
            isCustom: true
        });
    });

    // 9. SUBTOTAL: Invoice Price
    components.push({
        name: 'Invoice Price',
        value: cumulative,
        type: 'subtotal',
        cumulative: cumulative,
        percentOfList: (cumulative / priceData.listPrice) * 100
    });

    // 10. Payment Terms Impact
    const paymentTermsAmt = -1 * (priceData.listPrice * priceData.paymentTerms / 100);
    cumulative += paymentTermsAmt;
    components.push({
        name: 'Payment Terms',
        value: paymentTermsAmt,
        type: 'terms',
        cumulative: cumulative,
        percentOfList: (paymentTermsAmt / priceData.listPrice) * 100
    });

    // 11. Returns & Allowances
    const returnsAmt = -1 * (priceData.listPrice * priceData.returns / 100);
    cumulative += returnsAmt;
    components.push({
        name: 'Returns & Allowances',
        value: returnsAmt,
        type: 'allowance',
        cumulative: cumulative,
        percentOfList: (returnsAmt / priceData.listPrice) * 100
    });

    // Insert custom components at "after-invoice" position
    customComponents.filter(c => c.position === 'after-invoice').forEach(custom => {
        const customValue = calculateCustomValue(custom, cumulative);
        cumulative += customValue;
        components.push({
            name: custom.name,
            value: customValue,
            type: custom.type,
            cumulative: cumulative,
            percentOfList: (customValue / priceData.listPrice) * 100,
            isCustom: true
        });
    });

    // 12. SUBTOTAL: Net Pocket Price
    components.push({
        name: 'Net Pocket Price',
        value: cumulative,
        type: 'subtotal',
        cumulative: cumulative,
        percentOfList: (cumulative / priceData.listPrice) * 100
    });

    // 13. Unit Cost (COGS)
    cumulative -= priceData.unitCost;
    components.push({
        name: 'Unit Cost (COGS)',
        value: -priceData.unitCost,
        type: 'cost',
        cumulative: cumulative,
        percentOfList: (-priceData.unitCost / priceData.listPrice) * 100
    });

    // 14. FINAL: Gross Margin
    components.push({
        name: 'Gross Margin',
        value: cumulative,
        type: 'total',
        cumulative: cumulative,
        percentOfList: (cumulative / priceData.listPrice) * 100
    });

    return components;
}

// Calculate value for custom component
function calculateCustomValue(custom, currentCumulative) {
    if (custom.calcMethod === 'percent') {
        // Percentage of list price
        const baseValue = priceData.listPrice * custom.value / 100;
        // Discounts/costs are negative, additions are positive
        return custom.type === 'addition' ? baseValue : -baseValue;
    } else {
        // Fixed amount
        return custom.type === 'addition' ? custom.value : -custom.value;
    }
}


// ===================================
// UPDATE METRICS
// ===================================
function updateMetrics() {
    const listPrice = priceData.listPrice;
    const grossMargin = waterfallComponents[waterfallComponents.length - 1].cumulative;
    const netPocketPrice = waterfallComponents.find(c => c.name === 'Net Pocket Price')?.cumulative || 0;
    const leakage = listPrice - netPocketPrice;
    const leakagePercent = (leakage / listPrice) * 100;
    const realization = (netPocketPrice / listPrice) * 100;
    const marginPercent = (grossMargin / listPrice) * 100;

    document.getElementById('metricListPrice').textContent = formatCurrency(listPrice);
    document.getElementById('metricNetPrice').textContent = formatCurrency(netPocketPrice);
    document.getElementById('metricGrossMargin').textContent = formatCurrency(grossMargin);
    document.getElementById('metricMarginPercent').textContent = `${marginPercent.toFixed(1)}%`;
    document.getElementById('metricLeakage').textContent = formatCurrency(leakage);
    document.getElementById('metricLeakagePercent').textContent = `-${leakagePercent.toFixed(1)}%`;
    document.getElementById('metricRealization').textContent = `${realization.toFixed(1)}%`;
}

// ===================================
// UPDATE BREAKDOWN TABLE
// ===================================
function updateBreakdownTable() {
    const tbody = document.getElementById('breakdownTableBody');
    tbody.innerHTML = '';

    waterfallComponents.forEach(comp => {
        const row = document.createElement('tr');

        // Add class based on type
        if (comp.type === 'subtotal') {
            row.classList.add('row-subtotal');
        } else if (comp.type === 'total') {
            row.classList.add('row-total');
        } else if (comp.value < 0) {
            row.classList.add('row-negative');
        } else if (comp.value > 0 && comp.type !== 'total') {
            row.classList.add('row-positive');
        }

        // Component Name
        const nameCell = document.createElement('td');
        nameCell.textContent = comp.name;
        if (comp.type === 'subtotal' || comp.type === 'total') {
            nameCell.style.fontWeight = '700';
        }
        row.appendChild(nameCell);

        // Amount
        const amountCell = document.createElement('td');
        amountCell.textContent = formatCurrency(comp.value);
        row.appendChild(amountCell);

        // % of List
        const percentCell = document.createElement('td');
        percentCell.textContent = `${comp.percentOfList.toFixed(1)}%`;
        row.appendChild(percentCell);

        // Cumulative
        const cumulativeCell = document.createElement('td');
        cumulativeCell.textContent = formatCurrency(comp.cumulative);
        row.appendChild(cumulativeCell);

        tbody.appendChild(row);
    });
}

// ===================================
// WATERFALL CHART RENDERING
// ===================================
function drawWaterfall() {
    const canvas = chartCanvas;
    const ctx = chartCtx;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = { top: 40, right: 40, bottom: 100, left: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    const data = waterfallComponents;
    const barWidth = chartWidth / (data.length * 1.3);

    // Calculate value range
    const maxValue = Math.max(...data.map(d => Math.max(d.value, d.cumulative)));
    const minValue = Math.min(0, ...data.map(d => Math.min(d.value, d.cumulative)));
    const valueRange = maxValue - minValue;
    const rangePadding = valueRange * 0.1;

    // Helper function to get Y position
    function getY(value) {
        return padding.top + chartHeight - ((value - (minValue - rangePadding)) / (valueRange + rangePadding * 2)) * chartHeight;
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(168, 178, 193, 0.1)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const value = minValue - rangePadding + (valueRange + rangePadding * 2) * (i / gridLines);
        const y = getY(value);

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();

        // Grid value label
        ctx.fillStyle = '#6b7a8f';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(formatCurrency(value, 0), padding.left - 10, y + 4);
    }

    // Draw zero line (emphasized)
    if (minValue < 0 && maxValue > 0) {
        ctx.strokeStyle = 'rgba(168, 178, 193, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const zeroY = getY(0);
        ctx.moveTo(padding.left, zeroY);
        ctx.lineTo(canvas.width - padding.right, zeroY);
        ctx.stroke();
    }

    // Draw bars
    let previousCumulative = 0;
    data.forEach((component, index) => {
        const x = padding.left + (index * chartWidth / data.length);

        // Determine color
        let color;
        if (component.type === 'total') {
            color = '#8b5cf6'; // Purple for totals
        } else if (component.type === 'subtotal') {
            color = '#3b82f6'; // Blue for subtotals
        } else if (component.type === 'cost') {
            color = '#f59e0b'; // Orange for costs
        } else if (component.value < 0) {
            color = '#ef4444'; // Red for negative
        } else {
            color = '#10b981'; // Green for positive
        }

        // Draw bar
        let barY, barHeight;
        if (component.type === 'total' || component.type === 'subtotal') {
            // Totals/subtotals draw from zero to value
            barY = getY(component.value);
            barHeight = getY(0) - barY;
        } else {
            // Regular components draw from previous cumulative
            const startY = getY(previousCumulative);
            const endY = getY(component.cumulative);
            barY = Math.min(startY, endY);
            barHeight = Math.abs(endY - startY);
        }

        ctx.fillStyle = color;
        const actualBarWidth = barWidth * 0.7;
        const barX = x + (barWidth - actualBarWidth) / 2;
        ctx.fillRect(barX, barY, actualBarWidth, barHeight);

        // Draw bar outline for emphasis on totals
        if (component.type === 'total' || component.type === 'subtotal') {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(barX, barY, actualBarWidth, barHeight);
        }

        // Draw value label above/below bar
        ctx.fillStyle = '#f0f4f8';
        ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'center';
        const labelY = component.value >= 0 ? barY - 8 : barY + barHeight + 18;

        // For chart labels, we often want only the absolute value without symbol 
        // OR the full formatted value. Let's use the symbol + abs value for clarity.
        const symbol = getCurrencySymbol();
        ctx.fillText(`${symbol}${Math.abs(component.value).toFixed(1)}`, x + barWidth / 2, labelY);

        // Draw percentage label
        ctx.fillStyle = '#a8b2c1';
        ctx.font = '11px Inter';
        const percentY = component.value >= 0 ? barY - 22 : barY + barHeight + 32;
        ctx.fillText(`(${component.percentOfList.toFixed(1)}%)`, x + barWidth / 2, percentY);

        // Draw component label (rotated)
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - padding.bottom + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#a8b2c1';
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(component.name, 0, 0);
        ctx.restore();

        // Draw connecting line to next bar (if not last and not total/subtotal)
        if (index < data.length - 1 && component.type !== 'total' && component.type !== 'subtotal') {
            ctx.strokeStyle = '#6b7a8f';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            const connectionY = getY(component.cumulative);
            const nextX = padding.left + ((index + 1) * chartWidth / data.length);
            ctx.moveTo(barX + actualBarWidth, connectionY);
            ctx.lineTo(nextX + (barWidth - actualBarWidth) / 2, connectionY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw circle at connection point
            ctx.fillStyle = '#6b7a8f';
            ctx.beginPath();
            ctx.arc(barX + actualBarWidth, connectionY, 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Update previous cumulative
        if (component.type !== 'total' && component.type !== 'subtotal') {
            previousCumulative = component.cumulative;
        } else {
            previousCumulative = 0; // Reset for next section
        }

        // Store bar coordinates for interactivity
        component._chartBounds = {
            x: barX,
            y: barY,
            width: actualBarWidth,
            height: barHeight
        };
    });
}

// ===================================
// CHART INTERACTIVITY
// ===================================
function setupChartInteractivity() {
    const tooltip = document.getElementById('chartTooltip');

    chartCanvas.addEventListener('mousemove', (e) => {
        const rect = chartCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if mouse is over any bar
        let hoveredComponent = null;
        for (const comp of waterfallComponents) {
            if (!comp._chartBounds) continue;
            const b = comp._chartBounds;
            if (mouseX >= b.x && mouseX <= b.x + b.width &&
                mouseY >= b.y && mouseY <= b.y + b.height) {
                hoveredComponent = comp;
                break;
            }
        }

        if (hoveredComponent) {
            // Show tooltip
            document.getElementById('tooltipTitle').textContent = hoveredComponent.name;
            document.getElementById('tooltipValue').textContent = formatCurrency(hoveredComponent.value);
            document.getElementById('tooltipPercent').textContent = `${hoveredComponent.percentOfList.toFixed(1)}% of List Price`;

            tooltip.style.left = `${e.clientX - rect.left + 15}px`;
            tooltip.style.top = `${e.clientY - rect.top - 40}px`;
            tooltip.classList.add('active');

            chartCanvas.style.cursor = 'pointer';
        } else {
            tooltip.classList.remove('active');
            chartCanvas.style.cursor = 'default';
        }
    });

    chartCanvas.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
        chartCanvas.style.cursor = 'default';
    });
}

// ===================================
// ACTION HANDLERS
// ===================================
function resetDefaults() {
    if (confirm('Reset all values to defaults?')) {
        const savedCurrency = priceData.currentCurrency;
        priceData = {
            listPrice: 100,
            volumeDiscount: 10,
            customerRebate: 5,
            promoDiscount: 3,
            earlyPayment: 2,
            freight: 8,
            handling: 2,
            paymentTerms: 1.5,
            returns: 0.5,
            unitCost: 50,
            currentCurrency: savedCurrency
        };
        loadDefaultValues();
        recalculate();
    }
}

function exportData() {
    const exportObj = {
        priceData: priceData,
        components: waterfallComponents.map(c => ({
            name: c.name,
            value: c.value,
            percentOfList: c.percentOfList,
            cumulative: c.cumulative
        })),
        metrics: {
            listPrice: priceData.listPrice,
            netPrice: waterfallComponents[waterfallComponents.length - 1].cumulative,
            totalLeakage: priceData.listPrice - waterfallComponents[waterfallComponents.length - 1].cumulative,
            leakagePercent: ((priceData.listPrice - waterfallComponents[waterfallComponents.length - 1].cumulative) / priceData.listPrice) * 100,
            realizationRate: (waterfallComponents[waterfallComponents.length - 1].cumulative / priceData.listPrice) * 100
        },
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-waterfall-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function togglePanel(panelName) {
    const content = document.getElementById(panelName + 'Content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

function toggleChartView() {
    // Future enhancement: toggle between different chart views
    alert('Chart view toggle - coming soon!');
}

// ===================================
// CUSTOM COMPONENTS MANAGEMENT
// ===================================

// Load custom components from localStorage
function loadCustomComponents() {
    const saved = localStorage.getItem('priceWaterfallCustomComponents');
    if (saved) {
        try {
            customComponents = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load custom components:', e);
            customComponents = [];
        }
    }
}

// Save custom components to localStorage
function saveCustomComponents() {
    localStorage.setItem('priceWaterfallCustomComponents', JSON.stringify(customComponents));
}

// Show add component modal
function showAddComponentModal() {
    document.getElementById('addComponentModal').classList.add('active');
    // Reset form
    document.getElementById('newComponentName').value = '';
    document.getElementById('newComponentType').value = 'discount';
    document.getElementById('newComponentCalcMethod').value = 'percent';
    document.getElementById('newComponentValue').value = 0;
    document.getElementById('newComponentPosition').value = 'after-discounts';
    updateCalculationLabel();
}

// Close add component modal
function closeAddComponentModal() {
    document.getElementById('addComponentModal').classList.remove('active');
}

// Update calculation label based on method
function updateCalculationLabel() {
    const method = document.getElementById('newComponentCalcMethod').value;
    const label = document.getElementById('newComponentValueLabel');
    const symbol = getCurrencySymbol();
    label.textContent = method === 'percent' ? 'Default Value (%)' : `Default Value (${symbol})`;
}

// Add custom component
function addCustomComponent() {
    const name = document.getElementById('newComponentName').value.trim();
    const type = document.getElementById('newComponentType').value;
    const calcMethod = document.getElementById('newComponentCalcMethod').value;
    const value = parseFloat(document.getElementById('newComponentValue').value) || 0;
    const position = document.getElementById('newComponentPosition').value;

    if (!name) {
        alert('Please enter a component name');
        return;
    }

    // Check for duplicate names
    if (customComponents.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('A component with this name already exists');
        return;
    }

    const newComponent = {
        id: Date.now().toString(),
        name: name,
        type: type,
        calcMethod: calcMethod,
        value: value,
        position: position
    };

    customComponents.push(newComponent);
    saveCustomComponents();
    renderCustomComponentsList();
    closeAddComponentModal();
    recalculate();
}

// Render custom components list
function renderCustomComponentsList() {
    const container = document.getElementById('customComponentsList');
    const emptyState = document.getElementById('customComponentsEmpty');

    if (customComponents.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    const html = customComponents.map(comp => {
        const symbol = getCurrencySymbol();
        const unit = comp.calcMethod === 'percent' ? '%' : symbol;

        // Determine emoji based on type
        const emoji = (comp.type === 'discount' || comp.type === 'cost') ? '➖' : '➕';

        const positionLabel = comp.position === 'after-discounts' ? 'After Discounts' :
            comp.position === 'after-pocket' ? 'After Pocket Price' :
                'After Invoice Price';

        return `
            <div class="custom-component-item">
                <div class="custom-component-info">
                    <div class="custom-component-name">${comp.name}</div>
                    <div class="custom-component-meta">
                        <span class="custom-component-badge ${comp.type}">${emoji}</span>
                        <span>${positionLabel}</span>
                    </div>
                </div>
                <div class="custom-component-controls">
                    <input 
                        type="number" 
                        class="custom-component-input" 
                        value="${comp.value}" 
                        min="0" 
                        step="0.5"
                        onchange="updateCustomComponentValue('${comp.id}', this.value)"
                        placeholder="0">
                    <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${unit}</span>
                    <button class="btn-delete-custom" onclick="deleteCustomComponent('${comp.id}')" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html + '<div class="custom-components-empty" id="customComponentsEmpty" style="display: none;"></div>';
}

// Update custom component value
function updateCustomComponentValue(id, newValue) {
    const component = customComponents.find(c => c.id === id);
    if (component) {
        component.value = parseFloat(newValue) || 0;
        saveCustomComponents();
        recalculate();
    }
}

// Delete custom component
function deleteCustomComponent(id) {
    if (confirm('Delete this custom component?')) {
        // Ensure we compare strings to avoid type mismatch (some IDs might be numbers from templates)
        customComponents = customComponents.filter(c => String(c.id) !== String(id));
        saveCustomComponents();
        renderCustomComponentsList();
        recalculate();
    }
}


// ===================================
// TEMPLATE LOADING
// ===================================
function loadTemplate(templateKey) {
    if (!templateKey || templateKey === '') {
        return; // No template selected
    }

    const template = TEMPLATES[templateKey];
    if (!template) {
        console.error('Template not found:', templateKey);
        return;
    }

    // Update price data
    priceData = { ...template.priceData };

    // Update all input fields
    document.getElementById('inputListPrice').value = priceData.listPrice;
    document.getElementById('inputVolumeDiscount').value = priceData.volumeDiscount;
    document.getElementById('inputCustomerRebate').value = priceData.customerRebate;
    document.getElementById('inputPromoDiscount').value = priceData.promoDiscount;
    document.getElementById('inputEarlyPayment').value = priceData.earlyPayment;
    document.getElementById('inputFreight').value = priceData.freight;
    document.getElementById('inputHandling').value = priceData.handling;
    document.getElementById('inputPaymentTerms').value = priceData.paymentTerms;
    document.getElementById('inputReturns').value = priceData.returns;
    document.getElementById('inputUnitCost').value = priceData.unitCost;

    // Clear existing custom components
    customComponents = [];

    // Add template custom components
    template.customComponents.forEach(comp => {
        const newComponent = {
            id: (Date.now() + Math.random()).toString(), // Ensure ID is a string
            name: comp.emoji ? `${comp.emoji} ${comp.name}` : comp.name,
            type: comp.type,
            calcMethod: comp.calcMethod,
            value: comp.value,
            position: comp.position
        };
        customComponents.push(newComponent);
    });

    // Save and refresh
    saveCustomComponents();
    renderCustomComponentsList();
    recalculate();

    // Show notification
    showTemplateNotification(template.name);
}

// Show template loaded notification
function showTemplateNotification(templateName) {
    const notification = document.createElement('div');
    notification.className = 'template-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">Template loaded: <strong>${templateName}</strong></span>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// CURRENCY MANAGEMENT
// ===================================

// Helper to get current currency symbol
function getCurrencySymbol() {
    return CURRENCIES[priceData.currentCurrency]?.symbol || '$';
}

// Global currency formatter
function formatCurrency(amount, decimals = 2) {
    const symbol = getCurrencySymbol();
    return `${symbol}${amount.toFixed(decimals)}`;
}

// Change global currency
function changeCurrency(currencyCode) {
    if (!CURRENCIES[currencyCode]) return;

    priceData.currentCurrency = currencyCode;

    // Update all UI elements that show currency
    updateCurrencyUI();

    // Save state (if we were using discovery scan/persistence, but here just local memory)
    // In this app, we mostly just recalculate
    recalculate();

    // Show notification
    showCurrencyNotification(CURRENCIES[currencyCode]);
}

// Update UI elements that depend on currency symbol
function updateCurrencyUI() {
    const symbol = getCurrencySymbol();

    // Update input labels that show currency (e.g., "($)", "(₹)", "(د.إ)")
    // We target common patterns like ($) or (₹) using a broad regex
    // This allows sequential updates even after the initial ($) is gone
    const labels = document.querySelectorAll('label, span, th, option');

    // Pattern to match common currency symbols within parentheses
    // This handles $, ₹, £, ¥, Rs, and UAE Dirham (د.إ)
    const currencyRegex = /\((?:\$|₹|£|¥|Rs|د\.إ)\)/g;

    labels.forEach(el => {
        // Handle elements with simple text content
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            if (currencyRegex.test(el.textContent)) {
                el.textContent = el.textContent.replace(currencyRegex, `(${symbol})`);
            }
        } else {
            // Check innerHTML for more complex structures, but be careful not to break tags
            // For labels and spans, this is generally safe if they only contain text + icon
            if (currencyRegex.test(el.innerHTML)) {
                // If it's an option, we just use textContent
                if (el.tagName === 'OPTION') {
                    el.textContent = el.textContent.replace(currencyRegex, `(${symbol})`);
                } else {
                    // For others, try to replace only in text nodes to be safer
                    el.innerHTML = el.innerHTML.replace(currencyRegex, `(${symbol})`);
                }
            }
        }
    });

    // Update calculation label in modal (if it's already defined)
    if (typeof updateCalculationLabel === 'function') {
        updateCalculationLabel();
    }

    // Update Custom Components list units
    renderCustomComponentsList();
}

// Show currency changed notification
function showCurrencyNotification(currency) {
    const notification = document.createElement('div');
    notification.className = 'template-notification'; // Reusing template notification style
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${currency.flag}</span>
            <span class="notification-text">Currency set to: <strong>${currency.name} (${currency.symbol})</strong></span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
