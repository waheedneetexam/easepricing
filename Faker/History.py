import pandas as pd
import numpy as np
import random
from faker import Faker

# Initialize Faker for realistic names
fake = Faker()
Faker.seed(42)  # For reproducible results

def generate_pricing_data(num_records=1000):
    data = []
    
    # Define some base products and categories
    products = [
        ("PUMP-01", "Industrial", 250, 500), # (SKU, Category, Avg Cost, Avg List Price)
        ("VALVE-22", "Hydraulics", 60, 120),
        ("HOSE-09", "Accessories", 15, 45),
        ("MOTOR-X", "Electronics", 800, 1500),
        ("SEAL-05", "Accessories", 5, 12)
    ]
    
    # Define customer segments
    segments = ["Strategic", "Mid-Market", "Retail", "Distributor"]
    
    for i in range(num_records):
        txn_id = f"TXN-{1000 + i}"
        txn_date = fake.date_this_year()
        
        # Pick a random product
        sku, cat, avg_cost, avg_list = random.choice(products)
        
        # Add some variance to prices and costs (+/- 10%)
        unit_cost = round(avg_cost * random.uniform(0.9, 1.1), 2)
        list_price = round(avg_list * random.uniform(0.95, 1.05), 2)
        
        # Generate sales quantity
        qty = random.randint(1, 100)
        
        # Apply random discounts (between 0% and 25%)
        disc_pct = random.uniform(0, 0.25)
        on_inv_disc = round(list_price * disc_pct, 2)
        invoice_price = round(list_price - on_inv_disc, 2)
        
        # Add other waterfall components
        off_inv_rebate = round(invoice_price * random.uniform(0, 0.05), 2)
        freight_cost = round(random.uniform(5, 30), 2)
        
        data.append({
            "Transaction_ID": txn_id,
            "Transaction_Date": txn_date,
            "SKU_ID": sku,
            "Product_Category": cat,
            "Customer_Name": fake.company(),
            "Customer_Segment": random.choice(segments),
            "List_Price": list_price,
            "Invoice_Price": invoice_price,
            "Unit_Cost": unit_cost,
            "Quantity": qty,
            "On_Invoice_Disc": on_inv_disc,
            "Off_Invoice_Rebate": off_inv_rebate,
            "Freight_Cost": freight_cost
        })
    
    return pd.DataFrame(data)

# Generate the data
df = generate_pricing_data(1000)

# Save to CSV
df.to_csv("pricing_pilot_data_1000.csv", index=False)
print("File 'pricing_pilot_data_1000.csv' has been generated successfully.")