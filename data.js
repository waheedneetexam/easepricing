// Dummy data for the Pricing Quote Application

const PRODUCTS = [
    {
        id: 'NC-0001',
        code: 'G03AQk.5',
        name: '3G Squat Round',
        description: 'High-strength 3G Squat Round chemical compound',
        price: 125.50,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0002',
        code: 'G03AQk.6',
        name: '3G Tall Round W/H',
        description: '3G Tall Round with handle',
        price: 145.75,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0003',
        code: 'NC-0001',
        name: 'NyChem63A-B',
        description: 'Premium chemical compound NyChem63A-B',
        price: 289.99,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0004',
        code: 'NC-0002',
        name: 'NyChem63A-HS-B',
        description: 'High stability NyChem63A variant',
        price: 315.00,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0005',
        code: 'NC-0003',
        name: 'NyChem64A-B',
        description: 'Advanced NyChem64A compound',
        price: 275.50,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0006',
        code: 'NC-0004',
        name: 'NyChem64A-HS-B',
        description: 'NyChem64A high stability variant',
        price: 298.00,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0007',
        code: 'NC-0005',
        name: 'NyChem67A-B',
        description: 'Premium grade NyChem67A',
        price: 325.75,
        image: 'product-placeholder.png'
    },
    {
        id: 'NC-0008',
        code: 'NC-0006',
        name: 'NyChem84A-HS-B',
        description: 'High stability industrial grade compound',
        price: 405.99,
        image: 'product-placeholder.png'
    }
];

const CUSTOMERS = [
    { id: 'CH-0001', name: 'Chemical Industries Inc.' },
    { id: 'CH-0002', name: 'Global Pharma Corp.' },
    { id: 'CH-0003', name: 'Advanced Materials Ltd.' },
    { id: 'CH-0004', name: 'Industrial Solutions Group' }
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'INR', 'JPY'];

const UNITS_OF_MEASURE = ['LB', 'KG', 'TON', 'UNIT', 'GAL', 'LTR'];

const DISCOUNT_TYPES = [
    'Flat Discount %',
    'Tiered Discount %',
    'Volume Discount',
    'Promotional Discount'
];

const INCOTERMS = [
    'EXW - Ex Works',
    'FCA - Free Carrier',
    'FOB - Free on Board',
    'CFR - Cost and Freight',
    'CIF - Cost Insurance Freight',
    'DDP - Delivered Duty Paid'
];

// Waterfall data structure
const WATERFALL_STAGES = [
    { label: 'List Price', value: 11.4, type: 'positive' },
    { label: 'Customer Neg', value: -0.6, type: 'negative' },
    { label: 'Warehousing Adj', value: -0.2, type: 'negative' },
    { label: 'Packaging Adj', value: -0.0, type: 'zero' },
    { label: 'Customer Allocation', value: -0.0, type: 'zero' },
    { label: 'Invoice Price', value: 11.7, type: 'positive' },
    { label: 'Payment Terms', value: -0.1, type: 'negative' },
    { label: 'Net Price', value: 11.6, type: 'positive' },
    { label: 'Warehousing', value: -0.0, type: 'zero' },
    { label: 'Purchasing Cost', value: -0.0, type: 'zero' },
    { label: 'Pocket Price', value: 11.2, type: 'positive' },
    { label: 'Variable Cost', value: -7.9, type: 'negative' },
    { label: 'Pocket Margin', value: 3.3, type: 'positive' },
    { label: 'Fixed Cost', value: -1.7, type: 'negative' },
    { label: 'Gross Margin', value: 1.6, type: 'positive' }
];

// Sample quote data
const SAMPLE_QUOTE = {
    id: 'P-1148',
    status: 'Draft - All Changes Saved',
    effectiveDate: '2024-06-06',
    expiryDate: '2024-07-06',
    customer: 'CH-0003',
    currency: 'USD',
    discountType: 'Flat Discount %',
    discountPercent: 5,
    externalReference: 'REF-2024-Q2-089',
    items: [
        {
            productId: 'NC-0006',
            quantity: 1,
            unitOfMeasure: 'LB',
            price: 298.00,
            discount: 5,
            incoterm: 'FOB - Free on Board'
        },
        {
            productId: 'NC-0003',
            quantity: 1,
            unitOfMeasure: 'LB',
            price: 289.99,
            discount: 5,
            incoterm: 'FOB - Free on Board'
        }
    ]
};
