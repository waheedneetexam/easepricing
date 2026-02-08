// ===================================
// SURVEY STATE MANAGEMENT
// ===================================

let currentStep = 1;
const totalSteps = 4;

const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
    GBP: { symbol: '£', name: 'UK Pound' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
    JPY: { symbol: '¥', name: 'Japan Yen' },
    LKR: { symbol: 'Rs', name: 'Sri Lankan Rupee' }
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    updateCurrencySymbols();

    // Load saved data if exists
    loadSavedData();
});

// ===================================
// NAVIGATION FUNCTIONS
// ===================================
function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }

    saveCurrentStepData();

    if (currentStep < totalSteps) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');

        // Move to next step
        currentStep++;

        // Show next step
        document.getElementById(`step${currentStep}`).classList.add('active');

        // Update UI
        updateProgress();
        updateNavigationButtons();
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');

        // Move to previous step
        currentStep--;

        // Show previous step
        document.getElementById(`step${currentStep}`).classList.add('active');

        // Update UI
        updateProgress();
        updateNavigationButtons();
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const progressPercent = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    // Show/hide previous button
    if (currentStep === 1) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }

    // Show finish button on last step
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
    }
}

// ===================================
// VALIDATION
// ===================================
function validateCurrentStep() {
    let isValid = true;
    let errorMessage = '';

    switch (currentStep) {
        case 1:
            // Step 1: Basic Pricing
            const listPrice = parseFloat(document.getElementById('listPrice').value);
            const unitCost = parseFloat(document.getElementById('unitCost').value);

            if (!listPrice || listPrice <= 0) {
                errorMessage = 'Please enter a valid List Price.';
                isValid = false;
            } else if (!unitCost || unitCost <= 0) {
                errorMessage = 'Please enter a valid Unit Cost.';
                isValid = false;
            } else if (unitCost > listPrice) {
                errorMessage = 'Unit Cost cannot be greater than List Price.';
                isValid = false;
            }
            break;

        case 2:
            // Step 2: Template selection (always valid, has default)
            isValid = true;
            break;

        case 3:
            // Step 3: Discounts (volume discount is required, can be 0)
            const volumeDiscount = document.getElementById('volumeDiscount').value;
            if (volumeDiscount === '' || volumeDiscount === null) {
                errorMessage = 'Please enter Volume Discount (can be 0%).';
                isValid = false;
            }
            break;

        case 4:
            // Step 4: Other charges (all optional)
            isValid = true;
            break;
    }

    if (!isValid && errorMessage) {
        showError(errorMessage);
    }

    return isValid;
}

function showError(message) {
    alert(message); // Simple alert for now, can be enhanced with custom modal
}

// ===================================
// DATA MANAGEMENT
// ===================================
function saveCurrentStepData() {
    const surveyData = getSurveyData();
    localStorage.setItem('pricefx_survey_data', JSON.stringify(surveyData));
}

function getSurveyData() {
    return {
        listPrice: parseFloat(document.getElementById('listPrice').value) || 100,
        unitCost: parseFloat(document.getElementById('unitCost').value) || 50,
        currency: document.getElementById('currency').value || 'USD',
        template: getSelectedTemplate(),
        volumeDiscount: parseFloat(document.getElementById('volumeDiscount').value) || 0,
        customerRebate: parseFloat(document.getElementById('customerRebate').value) || 0,
        promoDiscount: parseFloat(document.getElementById('promoDiscount').value) || 0,
        earlyPayment: parseFloat(document.getElementById('earlyPayment').value) || 0,
        freight: parseFloat(document.getElementById('freight').value) || 0,
        handling: parseFloat(document.getElementById('handling').value) || 0,
        paymentTerms: parseFloat(document.getElementById('paymentTerms').value) || 0,
        returns: parseFloat(document.getElementById('returns').value) || 0
    };
}

function loadSavedData() {
    const savedDataStr = localStorage.getItem('pricefx_survey_data');
    if (!savedDataStr) return;

    try {
        const savedData = JSON.parse(savedDataStr);

        // Populate form fields
        if (savedData.listPrice) document.getElementById('listPrice').value = savedData.listPrice;
        if (savedData.unitCost) document.getElementById('unitCost').value = savedData.unitCost;
        if (savedData.currency) document.getElementById('currency').value = savedData.currency;
        if (savedData.template) selectTemplate(savedData.template);
        if (savedData.volumeDiscount !== undefined) document.getElementById('volumeDiscount').value = savedData.volumeDiscount;
        if (savedData.customerRebate !== undefined) document.getElementById('customerRebate').value = savedData.customerRebate;
        if (savedData.promoDiscount !== undefined) document.getElementById('promoDiscount').value = savedData.promoDiscount;
        if (savedData.earlyPayment !== undefined) document.getElementById('earlyPayment').value = savedData.earlyPayment;
        if (savedData.freight !== undefined) document.getElementById('freight').value = savedData.freight;
        if (savedData.handling !== undefined) document.getElementById('handling').value = savedData.handling;
        if (savedData.paymentTerms !== undefined) document.getElementById('paymentTerms').value = savedData.paymentTerms;
        if (savedData.returns !== undefined) document.getElementById('returns').value = savedData.returns;

        updateCurrencySymbols();
    } catch (e) {
        console.error('Error loading saved survey data:', e);
    }
}

// ===================================
// TEMPLATE SELECTION
// ===================================
function selectTemplate(templateId) {
    // Update radio button
    const radioBtn = document.getElementById(`template${capitalize(templateId)}`);
    if (radioBtn) {
        radioBtn.checked = true;
    }

    // Apply template values if not "scratch"
    if (templateId !== 'scratch') {
        applyTemplateValues(templateId);
    }
}

function getSelectedTemplate() {
    const selectedRadio = document.querySelector('input[name="template"]:checked');
    return selectedRadio ? selectedRadio.value : 'scratch';
}

function applyTemplateValues(templateId) {
    // Template configurations matching price-waterfall.js
    const templates = {
        amazon: {
            volumeDiscount: 8,
            customerRebate: 0,
            promoDiscount: 5,
            earlyPayment: 0,
            freight: 5,
            handling: 0,
            paymentTerms: 0,
            returns: 1
        },
        instagram_saree: {
            volumeDiscount: 5,
            customerRebate: 10,
            promoDiscount: 3,
            earlyPayment: 0,
            freight: 4,
            handling: 1,
            paymentTerms: 0,
            returns: 0.5
        },
        b2b_electronics: {
            volumeDiscount: 15,
            customerRebate: 10,
            promoDiscount: 0,
            earlyPayment: 2,
            freight: 20,
            handling: 5,
            paymentTerms: 1,
            returns: 0.3
        },
        saas: {
            volumeDiscount: 0,
            customerRebate: 0,
            promoDiscount: 10,
            earlyPayment: 0,
            freight: 0,
            handling: 0,
            paymentTerms: 0,
            returns: 0
        },
        fashion_retail: {
            volumeDiscount: 0,
            customerRebate: 12,
            promoDiscount: 8,
            earlyPayment: 0,
            freight: 8,
            handling: 3,
            paymentTerms: 0,
            returns: 1
        }
    };

    const template = templates[templateId];
    if (template) {
        // Only update if user is on step 2 or later
        if (currentStep >= 2) {
            document.getElementById('volumeDiscount').value = template.volumeDiscount;
            document.getElementById('customerRebate').value = template.customerRebate;
            document.getElementById('promoDiscount').value = template.promoDiscount;
            document.getElementById('earlyPayment').value = template.earlyPayment;
            document.getElementById('freight').value = template.freight;
            document.getElementById('handling').value = template.handling;
            document.getElementById('paymentTerms').value = template.paymentTerms;
            document.getElementById('returns').value = template.returns;
        }
    }
}

// ===================================
// CURRENCY HANDLING
// ===================================
function updateCurrencySymbols() {
    const currency = document.getElementById('currency').value;
    const symbol = CURRENCIES[currency].symbol;

    // Update all currency symbols in the form
    const currencySymbols = document.querySelectorAll('#currencySymbol1, #currencySymbol2, #currencySymbol3, #currencySymbol4');
    currencySymbols.forEach(el => {
        el.textContent = symbol;
    });
}

// ===================================
// SURVEY COMPLETION
// ===================================
function finishSurvey() {
    if (!validateCurrentStep()) {
        return;
    }

    saveCurrentStepData();

    // Redirect to main dashboard
    window.location.href = 'dashboard.html';
}

function skipSurvey() {
    // Clear any saved survey data
    localStorage.removeItem('pricefx_survey_data');

    // Redirect to main dashboard
    window.location.href = 'dashboard.html';
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function capitalize(str) {
    if (!str) return '';

    // Handle special cases
    const specialCases = {
        'scratch': 'Scratch',
        'amazon': 'Amazon',
        'instagram_saree': 'Instagram',
        'b2b_electronics': 'B2B',
        'saas': 'SaaS',
        'fashion_retail': 'Fashion'
    };

    return specialCases[str] || str.charAt(0).toUpperCase() + str.slice(1);
}
