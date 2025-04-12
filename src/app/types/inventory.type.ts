export interface InventoryItem {
    id: number;
    brand_name: string;
    type: string;
    quantity_on_hand: number;
    price: number;
    inventory_value: number;
    products_sold: number;
    sales_value: number;
}

export interface Filter {
    id: number | null;
    brand_name: string | null;
    type: string | null;
}

export interface InventoryValuation {
  type: string;
  totalQuantity: number;
  totalInventoryValue: number;
  totalProductsSold: number;
  totalSalesValue: number;
}